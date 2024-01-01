class DialogSessionLoad extends Dialog {
	/** @var {HTMLInputElement} */
	ElementSessionID
	/** @var {HTMLInputElement} */
	ElementGMPassword
	/** @var {HTMLSelectElement} */
	ElementSessionLength

	ButtonLoad

	constructor(element_or_selector, options) {
		super(element_or_selector, options);

		this.ElementSessionID = this.DialogElement.querySelector("#session_load_id");
		this.ElementGMPassword = this.DialogElement.querySelector("#session_load_pwd");
		this.ElementSessionLength = this.DialogElement.querySelector("#session_load_session_length");

		this.ButtonLoad = this.DialogElement.querySelector("#session_load_button");

		this.ButtonLoad.onclick = (event) => {
			this.Save();
		}
	}

	Open() {
		let history_element = document.querySelector("#history_element_session_load");
		if (history_element == null) {
			let history_anchor = document.createElement("div");
			history_anchor.className = "history_anchor";
			this.ElementSessionID.parentElement.appendChild(history_anchor);
			this.ElementSessionID.onfocus = (event) => {
				history_element.style.display = "block";
			}
			this.ElementSessionID.onblur = (event) => {
				setTimeout(() => {
					history_element.style.display = null;
				}, 200);
			}

			history_element = document.createElement("div");
			history_element.className = "history_viewer";
			history_anchor.appendChild(history_element);
		}

		history_element.innerHTML = "";

		let history = localStorage.getItem("history_session_id");
		if (history !== null && history !== "null") {
			history = JSON.parse(history);
			history.forEach((item) => {
				let history_item = document.createElement("div");
				history_item.className = "history_item";
				history_item.innerText = item;
				history_item.onclick = (event) => {
					this.ElementSessionID.value = event.currentTarget.innerText;
					setTimeout(() => {
						history_element.style.display = null;
					}, 100);
				}
				history_element.appendChild(history_item);
			})
		}
		super.Open();
	}

	Save() {
		let session_length = {};
		if (this.ElementSessionLength.value === "short")
			session_length = { hours: 4 };
		else if (this.ElementSessionLength.value === "medium")
			session_length = { days: 1 };
		else if (this.ElementSessionLength.value === "long")
			session_length = { months: 1 };
		else if (this.ElementSessionLength.value === "very_long")
			session_length = { years: 1 };
		session = new Session(this.ElementSessionID.value);
		session.LoadSession({ length: session_length, gm_pwd: this.ElementGMPassword.value, success_callback: (() => {
				let history = localStorage.getItem("history_session_id");
				if (history !== null) {
					history = JSON.parse(history);
				} else {
					history = [];
				}
				if (history.indexOf(this.ElementSessionID.value) === -1)
					history.push(this.ElementSessionID.value);
				localStorage.setItem("history_session_id", JSON.stringify(history));
				this.Close();
				dialog_session_create_join.Close();
				session.SyncCharacters();
			}),
			fail_callback: ((result, options = {}) => {
				const msg = options.msg ?? "";
				notifications.Error(msg);
			})
		});
	}
}