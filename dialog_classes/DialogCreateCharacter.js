
class DialogCreateCharacter extends Dialog {
	/** @var {HTMLInputElement} */
	FieldCharacterName

	/**
	 * @param {string} selector
	 */
	constructor(selector) {
		super(selector);
		this.FieldCharacterName = this.DialogElement.querySelector("#dialog_create_character_name");
		this.FieldCharacterName.onkeydown = (event) => { this.OnKeyDown(this, event) };
	}

	Save() {
		characters.push(new Character(this.FieldCharacterName.value, { fields: active_ruleset.GetFields(), pin_groups: active_ruleset.DefaultPins }));
		refresh_characters();
	}
}