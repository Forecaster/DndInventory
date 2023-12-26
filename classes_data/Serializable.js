
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

	static ResolvedObjects
	static #DeserializeResolveReferences(subject) {
		if (typeof subject === "undefined")
			return undefined;
		if (subject === null)
			return null;
		if (Serializable.ResolvedObjects.indexOf(subject) !== -1)
			return subject;
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
		Serializable.ResolvedObjects.push(object);
		return object;
	}

	static #DeserializeRemoveDuplicateReferences(subject) {
		if (typeof subject === "undefined")
			return undefined;
		if (subject === null)
			return null;
		if (typeof subject !== "object")
			return subject;
		if (Serializable.ResolvedObjects.indexOf(subject) !== -1)
			return subject;
		// console.debug("Remove duplicates in", subject);
		Serializable.ResolvedObjects.push(subject);
		if (Array.isArray(subject)) {
			const array_references = [];
			const new_array = [];
			// console.debug("Array");
			for (let i = 0; i < subject.length; i++) {
				// console.debug(subject[i]);
				if (subject[i] instanceof Serializable) {
					if (array_references.indexOf(subject[i].InstanceID) === -1) {
						new_array.push(Serializable.#DeserializeRemoveDuplicateReferences(subject[i]));
						array_references.push(subject[i].InstanceID);
					}
				} else if (!subject[i].hasOwnProperty("class_reference")) {
					new_array.push(Serializable.#DeserializeRemoveDuplicateReferences(subject[i]));
				} else {
					if (array_references.indexOf(subject[i].class_reference) === -1) {
						array_references.push(subject[i].class_reference);
						new_array.push(subject[i]);
					}
				}
			}
			// console.debug("post_array", new_array);
			Serializable.ResolvedObjects.push(new_array);
			return new_array;
		} else {
			for (const property in subject) {
				subject[property] = Serializable.#DeserializeRemoveDuplicateReferences(subject[property]);
			}
		}
		return subject;
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

		if (!sub_call) {
			Serializable.ResolvedObjects = [];
			object = this.#DeserializeRemoveDuplicateReferences(object);
			Serializable.ResolvedObjects = [];
			object = this.#DeserializeResolveReferences(object);
		}
		return object;
	}
}