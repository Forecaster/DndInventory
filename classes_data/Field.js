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
		// input.id = "field_" + (this.Key || this.Label);
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
		const label = this.Label.replace("'", "\\\'")
		const elements = Array.from(document.querySelectorAll(`[field-label='${label}']`));
		elements.forEach((element) => {
			element.value = this.Value;
		})
	}

	/**
	 * @param {string} key
	 * @param {{ [sum_values]:boolean, [return_array]:boolean, [return_last]:boolean, [default_value]:string|number }} [options]
	 */
	static FindValueOfKey(key, options = {}) {
		const sum_values = options.sum_values ?? false;
		const return_array = options.return_array ?? false;
		const return_last = options.return_last ?? false;
		const default_value = options.default_value ?? null;
		const values = [];
		key = key.toLowerCase();
		const parts = key.split(".");
		const last_part = parts.pop();
		let fields = []
		Field.FieldCollection.forEach((field) => {
			if (field.Key !== null && field.Key === last_part) {
				fields.push(field);
			}
		})

		let candidates = [];
		while (parts.length > 0) {
			const next_part = parts.pop();
			fields.forEach((field) => {
				if (field) {}
			})
		}

		return -1;

		if (sum_values) {
			let sum = 0;
			values.forEach((value) => {
				value = parseFloat(value);
				if (!isNaN(value))
					sum += value
			});
			return sum;
		}
		if (return_array)
			return values;
		if (values.length === 0)
			return default_value;
		if (return_last)
			return values.pop();
		return values[0];
	}

	static ParseFormula(formula) {
		const pattern_groups = /.*\(.*?\).*/g;
		const pattern_keys = /{([a-z_.]*)}/g;
		if (formula !== null) {
			let keys = Array.from(formula.matchAll(pattern_keys));
			keys.forEach((match) => {
				const key = match[1];
				const split = key.split(".");
				console.debug(split);
				const key_value = Field.FindValueOfKey(key);
				console.debug("value", key, key_value);
			})
		}
	}

	ParseFormula() {
		let formula = this.CustomFormula ?? this.Formula ?? null;
		// Field.ParseFormula(formula);
	}
}