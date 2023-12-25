
class Serializable {
	/** @var {string} */
	InstanceID

	static Instances = {}

	/**
	 */
	constructor() {
		this.InstanceID = unique_id(16);
		// console.debug(this.InstanceID);
	}

	static #SerializeArray(array) {
		if (!Array.isArray(array))
			return array;
		const new_array = [];
		array.forEach((item) => {
			if (Array.isArray(item)) {
				new_array.push(this.#SerializeArray(item));
			} else if (item instanceof Serializable) {
				new_array.push(item.Serialize(true));
			} else {
				new_array.push(item);
			}
		});
		return new_array;
	}

	Serialize(sub_call = false) {
		if (!sub_call)
			Serializable.Instances = {};
		else {
			if (Serializable.Instances[this.InstanceID]) {
				return { class_reference: this.InstanceID };
			}
		}

		const object = { class_name: this.constructor.name };
		Serializable.Instances[this.InstanceID] = true;

		for (const property in this) {
			const prop = this[property];
			if (typeof prop === "object") {
				if (prop instanceof Serializable) {
					object[property] = prop.Serialize(true);
				} else if (Array.isArray(prop)) {
					object[property] = Serializable.#SerializeArray(prop);
				}
			} else {
				object[property] = prop;
			}
		}
		if (!sub_call)
			return JSON.stringify(object);
		else
			return object;
	}

	/**
	 * @param {Array} array
	 * @returns {*[]}
	 */
	static #DeserializeArray(array) {
		if (!Array.isArray(array))
			return array;
		const new_array = [];
		array.forEach((item) => {
			if (Array.isArray(item)) {
				new_array.push(this.#DeserializeArray(item));
			} else  {
				new_array.push(Serializable.Deserialize(item, { sub_call: true }));
			}
		});
		return new_array;
	}

	static #DeserializeResolveReferences(subject) {
		if (typeof subject === "undefined")
			return undefined;
		if (subject === null)
			return null;
		// console.debug("Resolve references in ", subject);
		let object = subject;
		if (typeof subject === "object") {
			if (Array.isArray(subject)) {
				for (let i = 0; i < subject.length; i++) {
					subject[i] = this.#DeserializeResolveReferences(subject[i]);
				}
			} else if (subject.hasOwnProperty("class_reference")) {
				if (typeof Serializable.Instances[subject.class_reference] !== "undefined")
					object = Serializable.Instances[subject.class_reference];
				else
					console.error("Missing class reference for '" + subject.class_reference + "'");
			} else {
				for (let property in subject) {
					subject[property] = this.#DeserializeResolveReferences(subject[property]);
				}
			}
		}
		return object;
	}

	/**
	 * @param {{ class_name:string }|string} subject
	 * @param {{ [sub_call]:boolean }} [options]
	 */
	static Deserialize(subject, options = {}) {
		// console.debug("Deserialize", subject);
		const sub_call = options.sub_call ?? false;
		if (!sub_call)
			Serializable.Instances = {};
		if (typeof subject === "string") {
			try {
				subject = JSON.parse(subject);
			} catch (e) {
				return subject;
			}
		}

		let object = {};
		if (subject.hasOwnProperty("class_name")) {
			object = eval("new " + subject.class_name + "()");
			object.InstanceID = subject.InstanceID;
			Serializable.Instances[subject.InstanceID] = object;
		}

		for (const property in subject) {
			const prop = subject[property];
			if (typeof prop === "object") {
				if (Array.isArray(prop))
					object[property] = this.#DeserializeArray(prop);
				else
					object[property] = Serializable.Deserialize(prop, { sub_call: true });
			} else {
				object[property] = prop;
			}
		}

		if (!sub_call)
			object = this.#DeserializeResolveReferences(object);
		return object;
	}
}