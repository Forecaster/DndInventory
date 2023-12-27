
class FieldRow extends Field {
	/** @var {string} */
	Label
	/** @var {Field|null} */
	RowLabel
	/** @var {string[]} */
	RowTemplate
	/** @var {object[]} */
	RowData

	/**
	 * @param {string} label The header for the group of rows.
	 * @param {string[]} template An array of strings in the format `Label:type` where type is one of `string`, or `number`.
	 * @param {{ [row_label]:Field, [label_short]:string, [key]:string, [value]:any, [rollable]:string, [size]:int, [sub_fields]:Field[], [sub_field_divider]:string, [formula]:string }} [options]
	 */
	constructor(label, template, options = {}) {
		super(label, options);
		this.RowLabel = options.row_label ?? null;
		this.Template = template;
	}

	/**
	 * @param {{ [ignore_sub_field]:boolean, callbacks:{ [onblur]:function, [onfocus]:function, [onkeydown]:function, [onkeyup]:function } }} options
	 * @returns {HTMLInputElement[]}
	 */
	GetInput(options = {}) {
		return super.GetInput(options);
	}

	/*
	 * TODO Repeating group elements
	 * 	- Row add button label (default 'Add row')
	 * 	- Template is an array of Fields
	 * 	- Data is stored rather than the field itself
	 */
}