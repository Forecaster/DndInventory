
class DialogSessionCreateJoin extends Dialog {
	Open() {
		session = Session.RetrievePreviousSession();
		console.debug(session);
		session.ResumeSession({
			silent_fail: true,
			success_callback: (payload) => {
				notifications.Success("Session resumed!");
				session.SyncCharacters();
			},
			fail_callback: (result, msg, silent) => {
				if (!silent)
					notifications.Error("Failed to resume previous session! Error: " + msg);
				console.error(result, msg);
				super.Open();
			}
		});
	}
}