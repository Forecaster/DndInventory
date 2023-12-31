
class DialogCreateCharacter extends Dialog {
	/** @var {HTMLInputElement} */
	FieldCharacterName

	/**
	 * @param {string} selector
	 * @param {object} options
	 */
	constructor(selector, options = {}) {
		super(selector, options);
		this.FieldCharacterName = this.DialogElement.querySelector("#dialog_create_character_name");
		this.FieldCharacterName.onkeydown = (event) => { this.OnKeyDown(this, event) };
	}

	Save() {
		characters.push(new Character(this.FieldCharacterName.value, { owner: session.CurrentUsername, fields: active_ruleset.GetFields(), pin_groups: active_ruleset.DefaultPins }));
		this.FieldCharacterName.value = "";
		refresh_characters();
	}
}