
class DialogSessionCreateJoin extends Dialog {

	constructor(selector_or_element, options) {
		super(selector_or_element, options);
		this.DialogElement.addEventListener("keydown", (event) => {
			if (event.key === "Escape")
				event.preventDefault();
		})
	}
	Open() {
		session = Session.RetrievePreviousSession();
		session.ResumeSession({
			silent_fail: true,
			success_callback: (payload) => {
				notifications.Success("Session resumed!");
				session.SyncCharacters();
			},
			fail_callback: (result, options = {}) => {
				const silent = options.silent ?? false;
				const msg = options.msg ?? "";
				const data = options.data ?? "";
				if (!silent)
					notifications.Error(`Failed to resume previous session! Error: ${msg}`);
				console.error(result, msg, data);
				super.Open();
			}
		});
	}
}