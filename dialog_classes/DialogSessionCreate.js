
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
		session.ID = this.ElementSessionID.value;
		session.Name = this.ElementSessionName.value;
		session.Ruleset = this.ElementRuleset.value;
		session.RegisterSession({
			gm_pwd: this.ElementGMPassword.value,
			session_pwd: this.ElementSessionPassword.value,
			success_callback: () => {
				this.Close();
				dialog_session_create_join.Close();
				notifications.Success("New session has been created!");
				peer.RegisterHost(session.ID);
			},
			fail_callback: (result, options = {}) => {
				const msg = options.msg ?? "";
				notifications.Error(msg);
			}
		})
	}
}