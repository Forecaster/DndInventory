
class FieldNumber extends Field {
	Min
	Max

	/**
	 * @param {string} label
	 * @param {{ [label_short]:string, [key]:string, [value]:any, [rollable]:string, [min]:number, [max]:number, [size]:int, [sub_field]:Field, [sub_field_divider]:string, [formula]:string }} [options]
	 */
	constructor(label, options = {}) {
		super(label, options);
		this.Value = options.value || 0;
		this.Min = typeof options.min !== "undefined" ? options.min : null;
		this.Max = typeof options.max !== "undefined" ? options.max : null;
	}

	Clone() {
		let entry = super.Clone();
		entry.Min = this.Min;
		entry.Max = this.Max;
		return entry;
	}

	/**
	 * @param {{ [ignore_sub_field]:boolean, callbacks:{ [onblur]:function, [onfocus]:function, [onkeydown]:function, [onkeyup]:function } }} [options]
	 * @returns {HTMLInputElement[]}
	 */
	GetInput(options = {}) {
		let inputs = super.GetInput(options);
		let value_hold = null;
		function parse_operation(t) {
			if (value_hold !== null) {
				let val;
				if (t.value[0] === "+")
					val = value_hold + parseFloat(t.value.substring(1));
				else if (t.value[0] === "-")
					val = value_hold - parseFloat(t.value.substring(1));
				else if (t.value[0] === "*")
					val = value_hold * parseFloat(t.value.substring(1));
				else if (t.value[0] === "/")
					val = value_hold / parseFloat(t.value.substring(1));
				value_hold = null;
				return val;
			}
			return null;
		}
		inputs.forEach((input) => {
			if (input.getAttribute("field-type") === this.constructor.name && input.onclick == null) {
				input.addEventListener("click", (event) => {
					event.target.select();
				});

				input.addEventListener("keydown", (event) => {
					let action = false;
					let t = event.target;
					if (event.key === "Backspace")
						return;
					else if (event.key === "Delete")
						return;
				 	else if (event.key === ".")
						return;
					else if (event.key === "ArrowUp") {
						action = true;
						t.value = parseFloat(t.value) + 1;
					} else if (event.key === "ArrowDown") {
						action = true;
						t.value = parseFloat(t.value) - 1;
					} else if (event.key === "ArrowLeft") {
						action = true;
						t.value = parseFloat(t.value) - 10;
					} else if (event.key === "ArrowRight") {
						action = true;
						t.value = parseFloat(t.value) + 10;
					} else if (event.key === "*") {
						action = true;
						if (value_hold == null)
							value_hold = parseFloat(t.value);
						else
							value_hold = parse_operation(t)
						t.value = "*";
					} else if (event.key === "/") {
						action = true;
						if (value_hold == null)
							value_hold = parseFloat(t.value);
						else
							value_hold = parse_operation(t);
						t.value = "/";
					} else if (event.key === "+") {
						action = true;
						if (value_hold == null)
							value_hold = parseFloat(t.value);
						else
							value_hold = parse_operation(t);
						t.value = "+";
					} else if (event.key === "-") {
						action = true;
						if (value_hold == null)
							value_hold = parseFloat(t.value);
						else
							value_hold = parse_operation(t);
						t.value = "-";
					} else if (event.key === "Enter") {
						t.value = parse_operation(t) || t.value;
						t.select();
					} else if (isNaN(parseFloat(event.key)) && !event.ctrlKey) {
						action = true;
					}
					if (action) {
						event.preventDefault();
					}
					if (this.Min !== null && t.value < this.Min)
						t.value = this.Min;
					if (this.Max !== null && t.value > this.Max)
						t.value = this.Max;
				});
			}
		})
		return inputs;
	}
}