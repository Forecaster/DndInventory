
class FieldGroup extends Serializable {
	/** @var {string} */
	Label
	/** @var {Field[]} */
	Fields
	ParentObjects = [];

	/**
	 * Any number of fields can be supplied as parameters after `label` which will be added to the group.
	 * @param {string} label
	 */
	constructor(label) {
		super();
		this.Label = label;
		this.Fields = [];
		for (let i = 1; i < arguments.length; i++) {
			if (arguments[i] instanceof Field)
				this.Fields.push(arguments[i]);
		}
	}

	/**
	 * @param {Field} field
	 */
	AddField(field) {
		field.AddParentGroup(this);
		this.Fields.push(field);
	}

	Clone() {
		const constructor = Object.getPrototypeOf(this).constructor;
		/** @var {FieldGroup} */
		let entry = new constructor(this.Label);
		this.Fields.forEach((field) => {
			entry.AddField(field.Clone());
		})
		return entry;
	}
}