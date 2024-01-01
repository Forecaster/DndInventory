
class KeyStore {
	static Enabled = false;

	/** @var {Field[]} */
	static FieldCollection = [];
	/** @var {Object} */
	static KeyProviders = {};
	/** @var {Object} */
	static KeyUsers = {};

	/**
	 * @param {Field} field
	 */
	static AddField(field) {
		if (!KeyStore.Enabled)
			return;
		if (KeyStore.FieldCollection.indexOf(field) === -1)
			KeyStore.FieldCollection.push(field);
	}

	static RemoveField(field) {
		if (!this.Enabled)
			return;
		const index = KeyStore.FieldCollection.indexOf(field);
		if (index > 0)
			KeyStore.FieldCollection.splice(index, 1);
	}

	static AddKeyProver(field) {
		if (!KeyStore.Enabled)
			return;
		const key = field.Key;
		if (key === null || key === "")
			return;
		if (!Array.isArray(KeyStore.KeyProviders[key]))
			KeyStore.KeyProviders[key] = [];
		if (KeyStore.KeyProviders[key].indexOf(field) === -1)
			KeyStore.KeyProviders[key].push(field);
		const c = field.GetParentCharacter();
		if (c === null)
			return;
		const char_key = c.Name.toLowerCase() + "." + key;
		if (!Array.isArray(KeyStore.KeyProviders[char_key]))
			KeyStore.KeyProviders[char_key] = [];
		if (KeyStore.KeyProviders[char_key].indexOf(field) === -1)
			KeyStore.KeyProviders[char_key].push(field);
	}

	static RemoveKeyProvider(field) {
		if (!KeyStore.Enabled)
			return;
		const key = field.Key;
		if (key !== null && key !== "") {
			if (Array.isArray(KeyStore.KeyProviders[key])) {
				const index = KeyStore.KeyProviders[key].indexOf(field);
				if (index >= 0)
					KeyStore.KeyProviders[key].splice(index, 1);
			}
			const c = field.GetParentCharacter();
			if (c === null)
				return;
			const char_key = c.Name.toLowerCase() + "." + key;
			if (Array.isArray(KeyStore.KeyProviders[char_key])) {

			}
		} else {
			for (let key in KeyStore.KeyProviders) {
				let new_array = [];
				for (let i = 0; i < KeyStore.KeyProviders[key].length; i++) {
					if (KeyStore.KeyProviders[key][i] !== field)
						new_array.push(KeyStore.KeyProviders[key][i]);
				}
				KeyStore.KeyProviders[key] = new_array;
			}
		}
	}

	static AddKeyUser(key, field) {
		if (key === null || key === "")
			return;
		key = key.toLowerCase();
		if (!Array.isArray(KeyStore.KeyUsers[key]))
			KeyStore.KeyUsers[key] = [];
		if (KeyStore.KeyUsers[key].indexOf(field) === -1)
			KeyStore.KeyUsers[key].push(field);
	}

	static RemoveKeyUser(key, field) {
		if (key === null || key === "")
			return;
		key = key.toLowerCase();
		if (Array.isArray(KeyStore.KeyUsers[key])) {
			const index = KeyStore.KeyUsers[key].indexOf(field);
			if (index >= 0)
				KeyStore.KeyUsers.splice(index, 1);
		}
	}

	/**
	 * @param {string} key
	 */
	static FindFieldsByKey(key) {
		if (key === null)
			return [];

		key = key.toLowerCase();
		if (!Array.isArray(KeyStore.KeyProviders[key]))
			return [];
		return KeyStore.KeyProviders[key];
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
		if (key === null)
			return default_value;

		const matching_fields = KeyStore.FindFieldsByKey(key);

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

	/**
	 * @param {string} key
	 */
	static UpdateFieldsUsingKey(key) {
		if (key === null)
			return;
		const fields = KeyStore.KeyUsers[key];
		if (Array.isArray(fields)) {
			// console.debug("Update fields using key!", key, fields);
			fields.forEach((field) => {
				field.ParseFormula();
			})
		}
	}

	/**
	 * @param {string} formula
	 * @returns {string[]}
	 */
	static FormulaGetKeys(formula) {
		const pattern_keys = /{([a-z_.]*)}/g;
		if (formula === null || formula === "")
			return [];
		const matches = [...formula.matchAll(pattern_keys)];
		const keys = [];
		matches.forEach((match) => {
			keys.push(match[1]);
		})
		return keys;
	}

	/**
	 * @param {string} formula
	 * @returns {string}
	 */
	static ParseFormulaKeys(formula) {
		const pattern_keys = /{([a-z_.]*)}/;
		let match = true;
		while (match) {
			match = formula.match(pattern_keys);
			if (match !== null) {
				const value = KeyStore.FindValueOfKey(match[1], {default_value: 0});
				formula = formula.replace(match[0], value);
			}
		}
		return formula;
	}

	/**
	 * @param {string} formula
	 * @returns {number}
	 */
	static ParseFormula(formula) {
		if (formula === null)
			return 0;
		formula = this.ParseFormulaKeys(formula);
		return parse_math_expression(formula);
	}
}