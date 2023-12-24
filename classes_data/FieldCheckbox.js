class FieldCheckbox extends Field {
	IsChecked() {
		return this.Value === true;
	}

	/**
	 * @param {{ [ignore_sub_field]:boolean, callbacks:{ [onblur]:function, [onfocus]:function, [onkeydown]:function, [onkeyup]:function } }} options
	 * @returns {HTMLInputElement[]}
	 */
	GetInput(options = {}) {
		let inputs = super.GetInput(options);
		inputs.forEach((input) => {
			if (input.getAttribute("field-type") === this.constructor.name) {
				input.type = "checkbox";
				input.checked = this.IsChecked();
			}
		})
		return inputs;
	}
}