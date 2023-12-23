
class Serializable {

	static #SerializeArray(array) {
		let output = [];
		array.forEach((item) => {
			if (item instanceof Serializable)
				output.push(item.Serialize());
			else
				output.push(item);
		})
		return output;
	}

	Serialize() {
		let object = { deserializable: this.constructor.name };
		for(let prop in this) {
			let obj = this[prop];
			if (typeof obj === "object") {
				if (Array.isArray(obj)) {
					obj = Serializable.#SerializeArray(obj);
					object[prop] = obj;
				} else if (obj instanceof Serializable) {
					object[prop] = obj.Serialize();
				} else {
					object[prop] = obj;
				}
			} else {
				object[prop] = obj;
			}
		}
		return JSON.stringify(object);
	}

	static #DeserializeArray(array) {
	// 	console.debug("DeserializeArray", array);
		let output = [];
		array.forEach((item) => {
			if (typeof item === "string") {
				try {
					item = JSON.parse(item);
				} catch (e) {}
			}
			if (typeof item === "object") {
				if (Array.isArray(item)) {
					output.push(Serializable.#DeserializeArray(item));
				} else if (item.hasOwnProperty("deserializable")) {
					output.push(Serializable.Deserialize(item));
				} else {
					output.push(item);
				}
			} else {
				output.push(item);
			}
		})
		// console.debug("output", output);
		return output;
	}

	/**
	 * @param {{ deserializable:string }|string} object
	 */
	static Deserialize(object) {
		if (typeof object === "string")
			object = JSON.parse(object);
		// console.debug("Deserialize", object);
		let output = eval('new ' + object.deserializable + '()');
		delete object.deserializable;
		for (let prop in object) {
			let obj = object[prop];
			if (typeof obj === "string") {
				try {
					obj = JSON.parse(obj);
				} catch (e) {}
			}
			if (obj === null) {
				output[prop] = null;
			} else {
				if (typeof obj === "object") {
					if (Array.isArray(obj))
						output[prop] = Serializable.#DeserializeArray(obj);
					else if (obj.hasOwnProperty("deserializable"))
						output[prop] = Serializable.Deserialize(obj);
				} else {
					output[prop] = obj;
				}
			}
		}
		return output;
	}
}