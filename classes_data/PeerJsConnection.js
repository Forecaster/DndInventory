
class PeerJsEvent {
	static CONFIRM_CONNECT = new this("CONFIRM_CONNECT");
	static CLIENT_CONNECT = new this("CLIENT_CONNECT");
	static HOST_CONNECT = new this("HOST_CONNECT");
	static MESSAGE = new this("MESSAGE");

	constructor(name) {
		this.name = name;
	}

	toString() {
		return JSON.stringify(this);
	}

	/** @var {*} */
	event_data = null;
	/**
	 * @param {*} data
	 * @returns {string}
	 */
	data(data) {
		this.event_data = data;
		return this.toString();
	}

	get() {
		if (this.hasOwnProperty("data"))
			return this.data;
		return null;
	}

	static ParseEvent(event_or_string) {
		if (typeof event_or_string === "string") {
			try {
				event_or_string = JSON.parse(event_or_string);
			} catch (e) { return false; }
		}
		for (const key in this) {
			if (event_or_string.name === this[key].name) {
				if (event_or_string.hasOwnProperty("event_data"))
					this[key].event_data = event_or_string.event_data;
				return this[key];
			}
		}
		return null;
	}
}

class PeerJsConnection {
	IsHost = false;

	Username
	Peer
	HostConnection = null;
	ClientConnections = [];

	/** @var {function(message:string, sender:string)|null} */
	MessageHandler
	/** @var {function(PeerJsEvent)|null} */
	CustomEventHandler
	/** @var {function|null} */
	ConfirmConnectData

	/**
	 * @param {{ username:string, [message_handler]:function(message:string, sender:string), [custom_event_handler]:function(PeerJsEvent), [confirm_connect_data]:function }} [options]
	 */
	constructor(options = {}) {
		if (typeof Peer !== "function") {
			console.error("PeerJS library not loaded!");
			throw new Error("PeerJS library not loaded!");
		}
		this.Username = options.username ?? null;
		this.MessageHandler = options.message_handler ?? null;
		this.CustomEventHandler = options.custom_event_handler ?? null;
		this.ConfirmConnectData = options.confirm_connect_data ?? null;

		this.Peer = new Peer();
		const peer_js_connection = this;

		this.Peer.on('connection', function(conn) {
			console.info("Client connection established!");
			conn.on('data', data => { peer_js_connection.OnDataReceived(data, peer_js_connection) });
		});
	}

	OnDataReceived(data, peer_js_connection) {
		console.info("OnDataReceived", data);
		const event = PeerJsEvent.ParseEvent(data);
		console.debug("event", event);
		if (event === PeerJsEvent.CLIENT_CONNECT) {
			const connection = peer_js_connection.Peer.connect(event.event_data);
			connection.on('open', () => {
				peer_js_connection.ClientConnections.push(connection);
				console.debug("Confirm connection!");
				if (typeof this.ConfirmConnectData === "function")
					connection.send(PeerJsEvent.HOST_CONNECT);
				else
					connection.send(PeerJsEvent.HOST_CONNECT);
			})
		} else if (event === PeerJsEvent.HOST_CONNECT) {
			console.debug("Host connected.");
			if (typeof this.ConfirmConnectData === "function")
				this.HostConnection.send(PeerJsEvent.CONFIRM_CONNECT.data(this.ConfirmConnectData()));
			else
				this.HostConnection.send(PeerJsEvent.CONFIRM_CONNECT.data());
		} else if (event === PeerJsEvent.MESSAGE) {
			if (typeof this.MessageHandler === "function") {
				this.MessageHandler(PeerJsEvent.MESSAGE.event_data.content, PeerJsEvent.MESSAGE.event_data.sender);
			} else {
				console.warn("No message handler registered!");
			}
		}
		if (typeof this.CustomEventHandler === "function") {
			console.debug("Sending event to custom event handler", event);
			this.CustomEventHandler(event);
		}
	}

	RegisterHost(session_id, root = null) {
		if (root === null) {
			console.info(`Register peer host with session id '${session_id}'`);
			root = this;
		}
		const id = root.Peer.id;

		if (typeof id === "undefined" || id === null) {
			console.warn("No peer id! Retrying in two seconds...", id, peer.Peer._id);
			setTimeout(() => { root.RegisterHost(session_id, root) }, 500);
			return;
		}

		if (typeof id === "undefined" || id === "") {
			console.error("Failed to get id from Peer. Value:", id);
			return false;
		}

		const data = {
			mode: "register_host",
			session_id: session_id,
			peer_id: id
		}
		console.info("Attempting to connect...", data);
		jQuery.post("https://towerofawesome.org/signal_manager/", data)
			.done(payload => {
				payload = JSON.parse(payload);
				if (payload.result === 0) {
					console.debug(payload);
					root.IsHost = true;
				} else {
					console.error(payload);
				}
			})
			.fail(payload => {
				console.error(payload);
			})
	}

	ConnectToHost(session_id, root = null) {
		if (root === null) {
			console.info(`Connect to peer host with session id '${session_id}'`);
			root = this;
		}
		const id = root.Peer.id;

		if (id === null) {
			console.warn("No peer id! Retrying in two seconds...", id);
			setTimeout(() => { this.ConnectToHost(session_id, root) }, 500);
			return;
		}

		if (typeof id === "undefined" || id === "") {
			console.error("Failed to get id from Peer. Value:", id);
			return false;
		}

		const data = {
			mode: "connect_client",
			session_id: session_id
		}
		console.info("Attempting to connect...", data);
		jQuery.post("https://towerofawesome.org/signal_manager/", data)
			.done(payload => {
				/** @var {{ result:int, msg:string, data:{ host_peer_id:string }}} */
				payload = JSON.parse(payload);
				if (payload.result === 0) {
					try {
						const connection = this.Peer.connect(payload.data.host_peer_id);
						this.HostConnection = connection;
						connection.on('open', () => {
							console.warn("Connected!");
							connection.send(PeerJsEvent.CLIENT_CONNECT.data(id));
						})
					} catch (e) {
						console.error(e);
					}
				} else {
					if (payload.result === 4) {
						notifications.Error("Could not connect to host!");
					}
					console.error(payload);
				}
			})
			.fail(payload => {
				console.error(payload);
			})
	}

	SendEvent(event, data) {
		let e = event.data(data);
		if (this.HostConnection !== null) {
			this.HostConnection.send(e);
		}
		this.ClientConnections.forEach(connection => {
			connection.send(e);
		})
	}

	SendMessage(message, sender = "") {
		const payload = PeerJsEvent.MESSAGE.data({ content: message, sender: sender });
		if (this.HostConnection !== null) {
			this.HostConnection.send(payload);
		}
		this.ClientConnections.forEach(connection => {
			connection.send(payload);
		})
	}
}