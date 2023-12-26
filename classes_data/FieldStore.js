
class FieldStore {
	static Enabled = false;

	/** @var {Field[]} */
	static FieldCollection = [];
	/** @var {Field[]} */
	static KeyFieldCollection = [];

	/**
	 * @param {Field} field
	 */
	static AddField(field) {
		if (!FieldStore.Enabled)
			return;
		if (FieldStore.FieldCollection.indexOf(field) === -1)
			FieldStore.FieldCollection.push(field);
	}

	static RemoveField(field) {
		if (!this.Enabled)
			return;
		const index = FieldStore.FieldCollection.indexOf(field);
		if (index > 0)
			FieldStore.FieldCollection.splice(index);
	}

	static AddKeyField(field) {
		if (!FieldStore.Enabled)
			return;
		if (FieldStore.KeyFieldCollection.indexOf(field) === -1)
			FieldStore.KeyFieldCollection.push(field);
	}

	static RemoveKeyField(field) {
		if (!FieldStore.Enabled)
			return;
		const index = FieldStore.KeyFieldCollection.indexOf(field);
		if (index > 0)
			FieldStore.KeyFieldCollection.splice(index);
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
			failed += FieldStore.ValidateKeyPartChain(Array.from(key_parts), parent);
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
		FieldStore.FieldCollection.forEach((field) => {
			if (field.Key !== null && field.Key === last_part) {
				fields.push(field);
			}
		})

		/** @var {Field[]} */
		let matching_fields = [];
		if (parts.length > 1) {
			fields.forEach((field) => {
				const result = FieldStore.ValidateKeyPartChain(Array.from(parts), field) === 0;
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

	static UpdateFieldsUsingKey(key) {

	}
}