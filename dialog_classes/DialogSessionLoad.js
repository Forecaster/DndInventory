class DialogSessionLoad extends Dialog {
	/** @var {HTMLInputElement} */
	ElementSessionID
	/** @var {HTMLInputElement} */
	ElementGMPassword

	ButtonLoad

	constructor(element_or_selector, options) {
		super(element_or_selector, options);

		this.ElementSessionID = this.DialogElement.querySelector("#session_load_id");
		this.ElementGMPassword = this.DialogElement.querySelector("#session_load_pwd");

		this.ButtonLoad = this.DialogElement.querySelector("#session_load_button");

		this.ButtonLoad.onclick = (event) => {
			this.Save();
		}
	}

	Save() {
		session = new Session(this.ElementSessionID.value);
		session.LoadSession({ gm_pwd: this.ElementGMPassword.value, success_callback: (() => {
			this.Close();
			dialog_session_create_join.Close();
		}) });
	}
}