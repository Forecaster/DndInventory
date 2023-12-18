
class DialogSessionCreate extends Dialog {

	/** @var {HTMLInputElement} */
	ElementSessionID
	/** @var {HTMLInputElement} */
	ElementGMPassword
	/** @var {HTMLInputElement} */
	ElementSessionName
	/** @var {HTMLInputElement} */
	ElementSessionPassword
	/** @var {HTMLSelectElement} */
	ElementRuleset

	ButtonCreate

	constructor(selector, options) {
		super(selector, options);

		this.ElementSessionID = this.DialogElement.querySelector("#session_create_id");
		this.ElementGMPassword = this.DialogElement.querySelector("#session_create_gm_pwd");
		this.ElementSessionName = this.DialogElement.querySelector("#session_create_name");
		this.ElementSessionPassword = this.DialogElement.querySelector("#session_create_pwd");
		this.ElementRuleset = this.DialogElement.querySelector("#session_create_ruleset");
		this.ButtonCreate = this.DialogElement.querySelector("#session_create_button");

		this.ButtonCreate.onclick = (event) => {
			function test(input) {
				if (input.value.length <= 0) {
					input.classList.add("failed");
					return false;
				}
				input.classList.remove("failed");
				return true;
			}
			if (this.CheckInputs([this.ElementSessionID, this.ElementGMPassword, this.ElementSessionName, this.ElementSessionPassword],
				{ test_function: test }))
				this.Save();
		}
	}

	Open() {
		Session.GenerateSessionID((payload) => {
			if (payload.result === 0) {
				this.ElementSessionID.value = payload.data.id;
			}
		})
		super.Open();
	}

	Save() {
		jQuery.post("api/session_create.php", {
			id: this.ElementSessionID.value,
			name: this.ElementSessionName.value,
			gm_pwd: this.ElementGMPassword.value,
			pwd: this.ElementSessionPassword.value,
			ruleset: this.ElementRuleset.value
		}).done((payload) => {
			/** @var {{ result:int, msg:string, data: { session_data:{ id:string, name:string, ruleset:string }, path:string } }} payload */
			payload = JSON.parse(payload);
			console.debug(payload);
			if (payload.result === 0) {
				let session_data = payload.data.session_data
				session = new Session(session_data.id, { name: session_data.name, ruleset: session_data.ruleset });
				this.Close();
				dialog_session_create_join.Close();
			}
		})
	}
}