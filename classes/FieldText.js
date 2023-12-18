
class FieldText extends Field {
	/** @var string */
	Value

	constructor(label, options = {}) {
		super(label, options);
		this.Value = options.value || "";
	}
}