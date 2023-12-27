class Field extends Serializable {
	/** @var {string} */
	Label
	/** @var {string} */
	LabelShort
	/** @var {string} */
	Rollable
	/** @var {string} */
	_Key
	get Key() {
		return this._Key;
	}
	set Key(v) {
		this._Key = v;
		if (this._Key === null) {
			KeyStore.RemoveKeyProvider(this);
		} else {
			KeyStore.AddKeyProver(this);
		}
	}
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
	_Value
	get Value() {
		return this._Value;
	}
	set Value(v) {
		this._Value = v;
		this.Refresh();
		KeyStore.UpdateFieldsUsingKey(this.Key);
		const c = this.GetParentCharacter();
		if (c !== null)
			KeyStore.UpdateFieldsUsingKey(c.Name.toLowerCase() + "." + this.Key);
	}
	/** @var {string} */
	_Formula
	get Formula() {
		return this._Formula;
	}
	set Formula(v) {
		this._Formula = v;
		KeyStore.FormulaGetKeys(v).forEach((key) => {
			KeyStore.AddKeyUser(key, this);
		})
	}
	/** @var {string} */
	_UserFormula
	get UserFormula() {
		return this._UserFormula;
	}
	set UserFormula(v) {
		this._UserFormula = v;
		KeyStore.FormulaGetKeys(v).forEach((key) => {
			KeyStore.AddKeyUser(key, this);
		})
	}
	/** @var {string[]} */
	FormulaKeys
	/** @var {FieldGroup[]} */
	ParentObjects = [];

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

		KeyStore.AddField(this);
	}

	AddParentObject(object) {
		if (this.ParentObjects.indexOf(object) === -1) {
			this.ParentObjects.push(object);
		}
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
		input.addEventListener("dblclick", (event) => {
			popout_formula.Target = this;
			popout_formula.Show({ event: event });
		});
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
				inputs = inputs.concat(sub_field.GetField(options));
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

	Refresh(value = null) {
		if (value !== null)
			this._Value = value;
		const elements = Array.from(document.querySelectorAll(`#field_${this.InstanceID}`));
		elements.forEach((element) => {
			element.value = this.Value;
		})
	}

	ParseFormula() {
		let formula = this.UserFormula ?? this.Formula ?? null;
		if (formula === null || formula === "")
			return;
		const result = KeyStore.ParseFormula(formula);
		// console.debug("formula_result", result);
		this.Refresh(result);
		return result;
	}

	GetParentCharacter(subject = null) {
		if (subject === null)
			subject = this;
		if (!Array.isArray(subject.ParentObjects))
			return null;
		for (let i = 0; i < subject.ParentObjects.length; i++) {
			if (subject.ParentObjects[i] instanceof Character)
				return subject.ParentObjects[i];
			else {
				const sub_object = this.GetParentCharacter(subject.ParentObjects[i]);
				if (sub_object instanceof Character)
					return sub_object;
			}
		}
		return null;
	}

	FindFieldByLabel(label, lowercase = true) {
		if (lowercase) {
			if (this.Label.toLowerCase() === label.toLowerCase())
				return this;
		} else {
			if (this.Label === label)
				return this;
		}
		if (Array.isArray(this.SubFields)) {
			for (let i = 0; i < this.SubFields.length; i++) {
				const field = this.SubFields[i].FindFieldByLabel(label);
				if (field !== null)
					return field;
			}
		}
		return null;
	}
}