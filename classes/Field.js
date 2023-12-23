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
	/** @var {Field} */
	SubField
	/** @var {string} */
	SubFieldDivider
	/** @var {any} */
	Value
	/** @var {string} */
	Formula
	/** @var {string[]} */
	FormulaKeys

	/**
	 * @param {string} label
	 * @param {{ label_short:string, key:string, value:any, rollable:string, size:int, sub_field:Field, sub_field_divider:string, formula:string }} options
	 */
	constructor(label, options = {}) {
		super();
		console.debug(options);
		this.Label = label;
		this.LabelShort = options.label_short ?? null;
		this.Key = options.key ?? null;
		this.Rollable = options.rollable ?? null;
		this.Size = options.size ?? null;
		this.SubField = options.sub_field ?? null;
		this.SubFieldDivider = options.sub_field_divider ?? "";
		this.Value = options.value ?? null;
		this.Formula = options.formula ?? null;
	}

	/**
	 * @param {{ short_label:boolean, force_short_label:boolean }} options
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
	 * @param {{ callbacks:{ onblur:function, onfocus:function, onkeydown:function, onkeyup:function } }} options
	 * @returns {HTMLInputElement[]}
	 */
	GetInput(options = {}) {
		let inputs = [];
		let input = document.createElement("input");
		input.id = "field_" + (this.Key || this.Label);
		input.setAttribute("field-type", this.constructor.name);
		input.setAttribute("field-label", this.Label);
		input.setAttribute("field-key", this.Key);
		input.title = this.Label;
		input.classList.add("field");
		if (options.hasOwnProperty("callbacks")) {
			if (options.callbacks.hasOwnProperty("onblur"))
				input.onblur = options.callbacks.onblur;
			if (options.callbacks.hasOwnProperty("onfocus"))
				input.onfocus = options.callbacks.onfocus;
			if (options.callbacks.hasOwnProperty("onkeydown"))
				input.onkeydown = options.callbacks.onkeydown;
			if (options.callbacks.hasOwnProperty("onkeyup"))
				input.onkeyup = options.callbacks.onkeyup;
		}
		if (this.Size)
			input.style.width = "calc(" + this.Size + "ch + 8px)";
		if (this.Rollable)
			input.classList.add("rollable");
		if (typeof this.Value !== "undefined" && this.Value !== null)
			input.value = this.Value.toString();
		inputs.push(input);
		if (this.SubField !== null)
			inputs = inputs.concat(this.SubField.GetInput(options));
		return inputs;
	}

	/**
	 * @returns {Field}
	 * @constructor
	 */
	Clone() {
		const constructor = Object.getPrototypeOf(this).constructor;
		let sub = null;
		if (this.SubField !== null)
			sub = this.SubField.Clone();
		return new constructor(this.Label, {
			key: this.Key,
			rollable: this.Rollable,
			sub_field: sub,
			sub_field_divider: this.SubFieldDivider,
			value: this.Value,
			size: this.Size,
			formula: this.Formula,
			label_short: this.LabelShort,
		});
	}

	ParseFormula() {
		const pattern_groups = /.*\(.*?\).*/;
		if (this.Formula !== null) {

		}
	}
}