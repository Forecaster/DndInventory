class Field extends Serializable {
	/** @var {string} */
	Label
	/** @var {string} */
	LabelShort
	/** @var {string} */
	Rollable
	/** @var {string} */
	Key
	/** @var {int} */
	Size
	/** @var {Field[]} */
	_SubFields
	/**
	 * @returns {Field[]}
	 */
	get SubFields() {
		return this._SubFields;
	}

	/**
	 * @param {Field[]} v
	 */
	set SubFields(v) {
		const root = this;
		this._SubFields = v;
		this._SubFields._push = this._SubFields.push;
		this._SubFields.push = function(...items) {
			items.forEach((item) => {
				root._SubFields._push(item);
				item.AddParentObject(root);
			});
		}
		this._SubFields.forEach((field) => {
			field.AddParentObject(this);
		})
	}
	/** @var {string} */
	SubFieldDivider
	/** @var {any} */
	Value
	/** @var {string} */
	Formula
	/** @var {string} */
	CustomFormula
	/** @var {string[]} */
	FormulaKeys
	/** @var {FieldGroup[]} */
	ParentObjects = [];

	/** @var {Field[]} */
	static FieldCollection = [];

	/**
	 * @param {string} label
	 * @param {{ [label_short]:string, [key]:string, [value]:any, [rollable]:string, [size]:int, [sub_fields]:Field[], [sub_field_divider]:string, [formula]:string }} [options]
	 */
	constructor(label, options = {}) {
		super();
		this.Label = label;
		this.LabelShort = options.label_short ?? null;
		this.Key = options.key ?? null;
		this.Rollable = options.rollable ?? null;
		this.Size = options.size ?? null;
		this.SubFields = options.sub_fields ?? [];
		this.SubFieldDivider = options.sub_field_divider ?? "";
		this.Value = options.value ?? null;
		this.Formula = options.formula ?? null;

		Field.FieldCollection.push(this);
	}

	AddParentObject(object) {
		if (this.ParentObjects.indexOf(object) === -1)
			this.ParentObjects.push(object);
	}

	/**
	 * @param {{ [short_label]:boolean, [force_short_label]:boolean, [callbacks]:{ [onclick]:function, [onblur]:function, [onfocus]:function, [onkeydown]:function, [onkeyup]:function } }} [options]
	 * @return {HTMLDivElement}
	 */
	GetField(options = {}) {
		let container = document.createElement("div");
		container.classList.add("field_container");

		container.appendChild(this.GetLabel(options));
		let inputs = this.GetInput(options);
		let first = true;
		inputs.forEach((input) => {
			if (!first) {
				let divider = document.createElement("div");
				divider.className = "sub_field_divider";
				divider.innerText = this.SubFieldDivider;
				container.appendChild(divider);
			}
			container.appendChild(input);
			first = false;
		});
		return container;
	}

	/**
	 * @param {{ short_label:boolean, force_short_label:boolean }} options
	 * @return {HTMLLabelElement}
	 */
	GetLabel(options = {}) {
		let label = document.createElement("label");
		label.for = "field_" + (this.Key || this.Label);
		label.innerText = this.Label;
		if (options.short_label) {
			if (this.LabelShort !== null && this.LabelShort.length > 0)
				label.innerText = this.LabelShort;
			else if (options.force_short_label)
				label.innerText = this.Label.substring(0, 3);
		}
		return label;
	}

	/**
	 * @param {{ [ignore_sub_field]:boolean, callbacks:{ [onblur]:function, [onfocus]:function, [onkeydown]:function, [onkeyup]:function } }} options
	 * @returns {HTMLInputElement[]}
	 */
	GetInput(options = {}) {
		let inputs = [];
		let input = document.createElement("input");
		input.id = "field_" + this.InstanceID;
		input.setAttribute("field-type", this.constructor.name);
		input.setAttribute("field-label", this.Label);
		input.setAttribute("field-key", this.Key);
		input.title = this.Label;
		input.classList.add("field");
		input.classList.add("field-input");
		if (options.hasOwnProperty("callbacks")) {
			if (options.callbacks.hasOwnProperty("onclick"))
				input.addEventListener("click", options.callbacks.onclick);
			if (options.callbacks.hasOwnProperty("onblur"))
				input.addEventListener("blur", options.callbacks.onblur);
			if (options.callbacks.hasOwnProperty("onfocus"))
				input.addEventListener("focus", options.callbacks.onfocus);
			if (options.callbacks.hasOwnProperty("onkeydown"))
				input.addEventListener("keydown", options.callbacks.onkeydown);
			if (options.callbacks.hasOwnProperty("onkeyup"))
				input.addEventListener("keyup", options.callbacks.onkeyup);
		}
		if (this.Size)
			input.style.width = `calc(${this.Size}ch + 8px)`;
		if (this.Rollable)
			input.classList.add("rollable");
		if (typeof this.Value !== "undefined" && this.Value !== null)
			input.value = this.Value.toString();
		if (this.Formula !== null && this.Formula.length > 0) {
			input.setAttribute("readonly", "true");
			this.ParseFormula();
		}
		inputs.push(input);
		if (Array.isArray(this.SubFields) && !options.ignore_sub_field) {
			this.SubFields.forEach((sub_field) => {
				inputs.concat(sub_field.GetField(options));
			})
		}
		return inputs;
	}

	/**
	 * @param {HTMLElement} container
	 * @param {{ [callbacks]:{ [onblur]:function, [onfocus]:function, [onkeydown]:function, [onkeyup]:function } }} options
	 * @constructor
	 */
	AppendInput(container, options = {}) {
		const input = this.GetInput(options)[0];
		container.appendChild(input);
		if (Array.isArray(this.SubFields)) {
			const divider = document.createElement("span");
			divider.innerText = this.SubFieldDivider;
			divider.style.marginLeft = "8px";
			container.appendChild(divider);

			const sub_field_container = document.createElement("span");
			container.appendChild(sub_field_container);
			this.SubFields.forEach((sub_field) => {
				sub_field.AppendInput(sub_field_container, options);
			})
		}
	}

	/**
	 * @returns {Field}
	 * @constructor
	 */
	Clone() {
		const constructor = Object.getPrototypeOf(this).constructor;
		let sub = [];
		if (Array.isArray(this.SubFields)) {
			this.SubFields.forEach((sub_field) => {
				sub.push(sub_field.Clone());
			})
		}
		return new constructor(this.Label, {
			key: this.Key,
			rollable: this.Rollable,
			sub_fields: sub,
			sub_field_divider: this.SubFieldDivider,
			value: this.Value,
			size: this.Size,
			formula: this.Formula,
			label_short: this.LabelShort,
		});
	}

	Refresh() {
		const elements = Array.from(document.querySelectorAll(`#field_${this.InstanceID}`));
		elements.forEach((element) => {
			element.value = this.Value;
		})
	}

	/**
	 * @param {string[]} key_parts
	 * @param {Field|FieldGroup|Character} in_field
	 * @param {{ [lowercase]:boolean }} [options]
	 * @return {int} If continuous chain was found, returns 0 otherwise an integer greater than 0 is returned.
	 */
	static ValidateKeyPartChain(key_parts, in_field, options = {}) {
		const lowercase = options.lowercase ?? true;
		let target = in_field;
		// console.debug("Validate", key_parts, target);
		if (target instanceof Field) {
			const part = key_parts.pop();
			if (!match(target.Key, part, lowercase)) {
				// console.warn("Non-matching key:", target.Key);
				return 1;
			}
		} else if (target instanceof Character) {
			const part = key_parts.pop();
			if (!match(target.Name, part, lowercase) && !match(target.ID, part, lowercase)) {
				// console.warn("Non-matching name or ID:", target.Name, target.ID);
				return 1;
			}
		}
		if (!Array.isArray(target.ParentObjects)) {
			// console.info("No parent objects");
			return 0;
		}
		let failed = 0;
		target.ParentObjects.forEach((parent) => {
			failed += Field.ValidateKeyPartChain(Array.from(key_parts), parent);
		});
		return failed;
	}

	/**
	 * @param {string} key
	 * @param {{ [sum_values]:boolean, [return_fields]:boolean, [return_last]:boolean, [default_value]:string|number }} [options]
	 */
	static FindValueOfKey(key, options = {}) {
		const sum_values = options.sum_values ?? false;
		const return_fields = options.return_fields ?? false;
		const return_last = options.return_last ?? false;
		const default_value = options.default_value ?? null;
		key = key.toLowerCase();
		const parts = key.split(".");
		const last_part = parts[parts.length - 1];
		// console.debug("key_parts", parts, last_part);
		/** @var {Field[]} */
		let fields = []
		Field.FieldCollection.forEach((field) => {
			if (field.Key !== null && field.Key === last_part) {
				fields.push(field);
			}
		})

		/** @var {Field[]} */
		let matching_fields = [];
		if (parts.length > 1) {
			fields.forEach((field) => {
				const result = Field.ValidateKeyPartChain(Array.from(parts), field) === 0;
				if (result)
					matching_fields.push(field);
			})
		} else {
			matching_fields = fields;
		}

		if (sum_values) {
			let sum = 0;
			matching_fields.forEach((field) => {
				let value = parseFloat(field.Value);
				if (!isNaN(value))
					sum += value
			});
			return sum;
		}
		if (return_fields) {
			return matching_fields;
		}
		if (matching_fields.length === 0)
			return default_value;
		if (return_last)
			return matching_fields.pop().Value;
		return matching_fields[0].Value;
	}

	static ParseFormula(formula) {
		const pattern_keys = /{([a-z_.]*)}/;

		let match = true;
		while (match) {
			match = formula.match(pattern_keys);
			if (match !== null) {
				const value = Field.FindValueOfKey(match[1], {default_value: 0});
				formula = formula.replace(match[0], value);
			}
		}
		return parse_math_string(formula);
	}

	ParseFormula() {
		let formula = this.CustomFormula ?? this.Formula ?? null;
		// Field.ParseFormula(formula);
	}
}