class FieldCheckbox extends Field {
	IsChecked() {
		return this.Value === true;
	}

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