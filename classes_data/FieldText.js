
class FieldText extends Field {

	constructor(label, options = {}) {
		super(label, options);
		this.Value = options.value || "";
	}
}