/**
 * @property {{ name:string, characters:Character[], active:boolean }[]} Players
 */
class Session {
	/** @var {string} */
	ID
	/** @var {string} */
	Name
	/** @var {Ruleset} */
	Ruleset
	/** @var {int} */
	EncumbranceOption
	/** @var {string[]} */
	Players

	CurrentUsername = null;
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
	 * @param {{ name: string, ruleset:string, encumbrance_option:int }} options
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
	 * @param {{ id:string, name:string, ruleset:string, encumbrance_option:int }} object
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

	/**
	 * @param {{ session_pwd:string, gm_pwd:string, success_callback:function, fail_callback:function }} options Fail callback receives an error message as the first parameter.
	 */
	RegisterSession(options) {
		if (typeof options.success_callback !== "function")
			options.success_callback = () => {};
		if (typeof options.fail_callback !== "function")
			options.fail_callback = () => {};
		if (typeof this.ID !== "string" || this.ID.length !== 14) {
			options.fail_callback("Invalid session id");
			return;
		}
		if (typeof options.gm_pwd !== "string" || options.gm_pwd.length <= 0) {
			options.fail_callback("Invalid or blank GM password");
			return;
		}
		if (typeof options.session_pwd !== "string" || options.session_pwd.length <= 0) {
			options.fail_callback("Invalid or blank session password");
			return;
		}
		console.debug("SessionCreate", options);
		const data = { session_id: this.ID, name: this.Name, gm_pwd: options.gm_pwd, pwd: options.session_pwd, ruleset: this.Ruleset };
		API.Call("session_create", data, {
			data: data,
			success: () => {
				options.success_callback();
			},
			fail: (result, msg) => {
				options.fail_callback(result, msg);
			}
		});
	}

	/**
	 * @param {{ pwd:string, gm_pwd:string, success_callback:function, fail_callback:function }} options
	 */
	LoadSession(options) {
		if (typeof options.success_callback !== "function")
			options.success_callback = () => {};
		if (typeof options.fail_callback !== "function")
			options.fail_callback = () => {};
		console.debug("LoadSession", options);
		const data = { session_id: this.ID, gm_pwd: options.gm_pwd || null, pwd: options.pwd || null };
		API.Call("session_load",{
			data: data,
			/** @var {{ data:{ token:string, session_data:{ name:string, ruleset:string }}}} payload */
			success: (payload) => {
				this.Token = payload.data.token;
				this.Name = payload.data.session_data.name;
				this.Ruleset = Ruleset[payload.data.session_data.ruleset];
				options.success_callback();
				localStorage.setItem("session_token", this.Token);
			},
			fail: (result, msg) => {
				options.fail_callback(result, msg);
			}
		});
	}

	/**
	 *
	 * @param {{ pwd:string, success_callback:function, fail_callback:function }} options
	 */
	JoinSession(options) {
		if (typeof options.success_callback !== "function")
			options.success_callback = () => {};
		if (typeof options.fail_callback !== "function")
			options.fail_callback = () => {};
		console.debug("JoinSession", options);
		const data = { session_id: this.ID, username: this.CurrentUsername, pwd: options.pwd || null };
		API.Call("session_join", {
			data: data,
			success: () => {
				this.Token = payload.data.token;
				options.success_callback();
			},
			fail: (result, msg) => {
				options.fail_callback(msg);
			}
		});
	}

	SyncCharacters() {
		const data = { session_id: this.ID, username: this.CurrentUsername, token: this.Token, last_sync: this.#LastSync };
		/** @var {{ result:number, msg:string, data:{ characters:object } }} payload */
		API.Call("character_sync", {
			data: data,
			success: (payload) => {
				this.#LastSync = new Date().getTime();
				const character_list = payload.data.characters;
				console.debug(character_list);

				characters = [];

				for (let id in character_list) {
					const character = character_list[id];
					let c = Serializable.Deserialize(character);
					c.ID = id;
					console.debug(c);
					characters.push(c);
				}
				refresh_characters();
				notifications.Success(`${characters.length} character${characters.length===1?"":"s"} loaded from server!`);
			}
		});
	}
}