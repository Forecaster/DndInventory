
class Session {
	/** @var {string|null} */
	ID
	/** @var {string|null} */
	Name
	/** @var {Ruleset|null} */
	Ruleset
	/** @var {int} */
	EncumbranceOption
	/** @var {string[]} */
	Players

	CurrentUsername = null;
	/** @var {string|null} */
	Token

	/** @var {number} */
	#PingTimerID
	/** @var {int} */
	#LastSync

	static GenerateSessionID(callback) {
		API.Call("get_new_session_id", {
			success: (payload) => {
				if (typeof callback === "function")
					callback(payload);
			}
		});
	}

	/**
	 * @param {string} id
	 * @param {{ [name]: string, [ruleset]:string, [encumbrance_option]:int }} [options]
	 */
	constructor(id, options = {}) {
		this.ID = id;
		this.Name = options.name || null;
		this.Ruleset = Ruleset[options.ruleset] || null;
		this.EncumbranceOption = options.encumbrance_option || 0;

		this.Players = [];
	}

	toString() {
		return JSON.stringify(this);
	}

	/**
	 * @param {{ [id]:string, [name]:string, [ruleset]:string, [encumbrance_option]:int }} object
	 * @returns {this}
	 */
	static fromJson(object) {
		return new this(object.id, { name: object.name ?? null, ruleset: object.ruleset ?? null, encumbrance_option: object.encumbrance_option ?? 0 });
	}

	StartPingTimer() {
		if (this.#PingTimerID !== null)
			clearInterval(this.#PingTimerID);
		const session = this;
		this.#PingTimerID = setInterval(() => {
			this.SyncCharacters();
		}, 5000);
	}

	StorePreviousSession(token = null, id = null, player = null) {
		if (token !== null)
			this.Token = token;
		localStorage.setItem("session_token", this.Token);
		if (id !== null)
			this.ID = id;
		localStorage.setItem("session_id", this.ID);
		if (player !== null)
			this.CurrentUsername = player;
		if (this.CurrentUsername !== null)
			localStorage.setItem("session_player", this.CurrentUsername);
		else
			localStorage.removeItem("session_player");
	}

	static RetrievePreviousSession() {
		const session = new Session("");
		session.Token = localStorage.getItem("session_token");
		session.ID = localStorage.getItem("session_id");
		session.CurrentUsername = localStorage.getItem("session_player");
		return session;
	}

	/**
	 * @param {{ [session_pwd]:string, [gm_pwd]:string, [success_callback]:function(payload:object), [fail_callback]:function(result:number, msg:string) }} [options] Fail callback receives an error message as the first parameter.
	 */
	RegisterSession(options= {}) {
		if (typeof options.success_callback !== "function")
			options.success_callback = (payload) => { console.info(payload) };
		if (typeof options.fail_callback !== "function")
			options.fail_callback = (result, msg) => { console.error(result, msg) };
		if (typeof this.ID !== "string" || this.ID.length !== 14) {
			options.fail_callback(-1, "Invalid or no session id set.");
			return;
		}
		if (typeof options.gm_pwd !== "string" || options.gm_pwd.length <= 2) {
			options.fail_callback(-2, "Invalid or blank GM password");
			return;
		}
		if (typeof options.session_pwd !== "string" || options.session_pwd.length <= 2) {
			options.fail_callback(-3, "Invalid or blank session password");
			return;
		}
		console.debug("SessionCreate", options);
		const data = { session_id: this.ID, name: this.Name, gm_pwd: options.gm_pwd, pwd: options.session_pwd, ruleset: this.Ruleset };
		API.Call("session_create", {
			data: data,
			success: (payload) => {
				this.Mode = "load";
				this.StorePreviousSession(payload.data.token);
				this.SessionStart();
				options.success_callback(payload);
			},
			fail: (result, msg) => {
				options.fail_callback(result, msg);
			}
		});
	}

	/**
	 * @param {{ [pwd]:string, [gm_pwd]:string, [success_callback]:function(payload:object), [fail_callback]:function(result:number, msg:string) }} [options]
	 */
	LoadSession(options= {}) {
		if (typeof options.success_callback !== "function")
			options.success_callback = (payload) => { console.info(payload) };
		if (typeof options.fail_callback !== "function")
			options.fail_callback = (result, msg) => { console.error(result, msg) };
		console.debug("LoadSession", options);
		const data = { session_id: this.ID, gm_pwd: options.gm_pwd || null, pwd: options.pwd || null };
		API.Call("session_load",{
			data: data,
			success: (payload) => {
				this.StorePreviousSession(payload.data.token);
				this.Name = payload.data.session_data.name;
				this.Ruleset = Ruleset[payload.data.session_data.ruleset];
				this.SessionStart();
				options.success_callback(payload);
			},
			fail: (result, msg) => {
				options.fail_callback(result, msg);
			}
		});
	}

	/**
	 *
	 * @param {{ [pwd]:string, [success_callback]:function(payload:object), [fail_callback]:function(result:number, msg:string) }} [options]
	 */
	JoinSession(options= {}) {
		if (typeof options.success_callback !== "function")
			options.success_callback = (payload) => { console.info(payload) };
		if (typeof options.fail_callback !== "function")
			options.fail_callback = (result, msg) => { console.error(result, msg) };
		console.debug("JoinSession", options);
		const data = { session_id: this.ID, username: this.CurrentUsername, pwd: options.pwd || null };
		API.Call("session_join", {
			data: data,
			success: (payload) => {
				this.StorePreviousSession(payload.data.token);
				options.success_callback(payload);
				this.SessionStart();
			},
			fail: (result, msg) => {
				options.fail_callback(result, msg);
			}
		});
	}

	/**
	 * @param {{ [silent_fail]:boolean, [success_callback]:function(payload:object), [fail_callback]:function(result:number, msg:string, silent:boolean) }} [options]
	 * The `silent_fail` parameter forces method to only produce error callbacks when failing in the api call. Missing values in the session instance
	 * will silently fail. Fail callback will still be called, but will have the parameter `silent` set to true.
	 */
	ResumeSession(options = {}) {
		const silent = options.silent_fail ?? false;
		if (typeof options.success_callback !== "function")
			options.success_callback = (payload) => { console.info(payload) };
		if (typeof options.fail_callback !== "function")
			options.fail_callback = (result, msg) => { console.error(result, msg) };
		if (typeof this.ID !== "string" || this.ID.length !== 14) {
			options.fail_callback(-1, "Invalid or no session id set.", silent);
			return;
		}
		if (typeof this.Token === "undefined" || this.Token === null || this.Token.length === 0) {
			options.fail_callback(-2, "Invalid or no token set.", silent);
			return;
		}
		const data = { session_id: this.ID, token: this.Token, player: this.CurrentUsername };
		API.Call("session_resume", {
			data: data,
			success: (payload) => {
				this.Name = payload.data.session_data.name;
				this.Ruleset = payload.data.session_data.ruleset;
				options.success_callback(payload);
				this.SessionStart();
			},
			fail: (result, msg) => {
				options.fail_callback(result, msg, silent);
			},
			error: (payload) => {
				options.fail_callback(-3, `${payload.status} ${payload.statusText}`, silent);
			}
		})
	}

	SyncCharacters() {
		const data = { session_id: this.ID, username: this.CurrentUsername, token: this.Token, last_sync: this.#LastSync };
		/** @var {{ result:number, msg:string, data:{ characters:object } }} payload */
		API.Call("character_sync", {
			data: data,
			success: (payload) => {
				this.#LastSync = new Date().getTime();
				const character_list = payload.data.characters;
				characters = [];
				for (let id in character_list) {
					const character = character_list[id];
					let c = Serializable.Deserialize(character);
					c.ID = id;
					characters.push(c);
				}
				refresh_characters();
				notifications.Success(`${characters.length} character${characters.length===1?"":"s"} loaded from server!`);
			}
		});
	}

	SessionStart() {
		const container = document.getElementById("menu_container_actions")
		container.innerHTML = "";

		active_ruleset.Actions.forEach((action) => {
			let btn = document.createElement("div");
			btn.classList.add("menu_button");
			btn.innerText = action.label;
			btn.addEventListener("click", () => {
				dialog_action.Open(action);
			});
			container.appendChild(btn);
		})
	}
}