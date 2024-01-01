class DialogSessionJoin extends Dialog {
	ElementPlayerName
	ElementSessionID
	ElementSessionPwd

	constructor(selector_or_element, options = {}) {
		super(selector_or_element, options);

		this.ElementPlayerName = this.DialogElement.querySelector("#session_join_player_name");
		this.ElementSessionID = this.DialogElement.querySelector("#session_join_id");
		this.ElementSessionPwd = this.DialogElement.querySelector("#session_join_pwd");
	}

	Save() {
		const session_id = this.ElementSessionID.value;
		if (typeof session_id === "undefined" || session_id === "") {
			notifications.Error("Must specify a session ID.");
			return;
		}
		const player_name = this.ElementPlayerName.value;
		if (typeof player_name === "undefined" || player_name === "") {
			notifications.Error("Must specify a player name.");
			return;
		}
		const pwd = this.ElementSessionPwd.value;
		if (pwd.length === 0) {
			notifications.Error("Password cannot be empty.");
			return;
		}

		session.ID = session_id;
		session.CurrentUsername = player_name;
		session.JoinSession({
			pwd: pwd,
			success_callback: payload => {
				notifications.Success("Connected to session!");
				this.Close();
				dialog_session_create_join.Close();
			}
		});
	}
}