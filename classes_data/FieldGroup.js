
class FieldGroup extends Serializable {
	/** @var {string} */
	Label
	/** @var {Field[]} */
	_Fields
	/**
	 * @returns {Field[]}
	 */
	get Fields() {
		return this._Fields;
	}

	/**
	 * @param {Field[]} v
	 */
	set Fields(v) {
		const root = this;
		this._Fields = v;
		this._Fields._push = this._Fields.push;
		this._Fields.push = function(...items) {
			items.forEach((item) => {
				root._Fields._push(item);
				item.AddParentObject(root);
			});
		}
		this._Fields.forEach((field) => {
			field.AddParentObject(this);
		})
	}
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

	AddParent(parent) {
		if (this.ParentObjects.indexOf(parent) === -1)
			this.ParentObjects.push(parent);
	}

	Clone() {
		const constructor = Object.getPrototypeOf(this).constructor;
		/** @var {FieldGroup} */
		let entry = new constructor(this.Label);
		this.Fields.forEach((field) => {
			entry.Fields.push(field.Clone());
		})
		return entry;
	}
}