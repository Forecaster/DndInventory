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
	#GMSession = false;
	#SessionToken
	#PingTimerID

	static GenerateSessionID(callback) {
		jQuery.post("api/get_new_session_id.php")
			.done((payload) => {
				if (typeof callback === "function")
					callback(JSON.parse(payload));
			})
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

	StartPingTimer() {
		if (this.#PingTimerID !== null)
			clearInterval(this.#PingTimerID);
		const session = this;
		this.#PingTimerID = setInterval(() => {
			jQuery.post("api/session_ping.png", { id: session.ID, token: session.#SessionToken });
		}, 5000);
	}

	/**
	 * @param {{ session_pwd:string, gm_pwd:string, success_callback:function, fail_callback:function }} options Fail callback receives an error message as the first parameter.
	 */
	CreateSession(options) {
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
		jQuery.post("api/session_create.php", { id: this.ID, name: this.Name, gm_pwd: options.gm_pwd, pwd: options.session_pwd, ruleset: this.Ruleset })
			.done((payload) => {
				payload = JSON.parse(payload);
				console.debug(payload);
				if (payload.result === 0)
					options.success_callback();
				else
					options.fail_callback(payload['msg']);
			})
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
		jQuery.post("api/session_load.php", { id: this.ID, gm_pwd: options.gm_pwd || null, pwd: options.pwd || null })
			.done((payload) => {
				payload = JSON.parse(payload);
				console.debug(payload);
				if (payload.result === 0) {
					this.#GMSession = true;
					this.Name = payload['data']['session_data']['name'];
					this.Ruleset = payload['data']['session_data']['ruleset'];
					options.success_callback();
				} else
					options.fail_callback(payload['msg']);
			})
	}

	/**
	 *
	 * @param {{ pwd:string, gm_pwd:string, success_callback:function, fail_callback:function }} options
	 */
	JoinSession(options) {
		if (typeof options.success_callback !== "function")
			options.success_callback = () => {};
		if (typeof options.fail_callback !== "function")
			options.fail_callback = () => {};
		console.debug("JoinSession", options);
		jQuery.post("api/session_join.php", { id: this.ID, username: this.CurrentUsername, gm_pwd: options.gm_pwd || null, pwd: options.pwd || null })
			.done((payload) => {
				payload = JSON.parse(payload);
				console.debug(payload);
				if (payload.result === 0) {
					this.#SessionToken = payload.data.token;
					if (payload.data.token.indexOf("GM_") === 0)
						this.#GMSession = true;
					options.success_callback();
				} else {
					options.fail_callback(payload['msg']);
				}
			})
	}

	SendAPIRequest(endpoint, data, options) {

	}

	GetRuleset() {
		return this.Ruleset;
	}
}