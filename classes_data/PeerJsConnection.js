
class PeerJsEvent {
	static CLIENT_CONNECT = new this("Client connect");
	static HOST_CONNECT = new this("Host connect");
	static MESSAGE = new this("Message");

	constructor(name) {
		this.name = name;
	}

	toString() {
		return JSON.stringify(this);
	}

	/** @var {*} */
	event_data = null;
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
				if (event_or_string.hasOwnProperty("data"))
					this[key].event_data = event_or_string.event_data;
				return this[key];
			}
		}
		return null;
	}
}

class PeerJsConnection {
	IsHost = false;

	Peer
	HostConnection = null;
	ClientConnections = [];

	/** @var {function(message:string, sender:string)|null} */
	MessageHandler
	/** @var {function(PeerJsEvent)|null} */
	CustomEventHandler

	/**
	 * @param {{ [message_handler]:function(message:string, sender:string), [custom_event_handler]:function(PeerJsEvent) }} [options]
	 */
	constructor(options = {}) {
		if (typeof Peer !== "function") {
			console.error("PeerJS library not loaded!");
			throw new Error("PeerJS library not loaded!");
		}
		this.MessageHandler = options.message_handler ?? null;
		this.CustomEventHandler = options.custom_event_handler ?? null;

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
			peer_js_connection.ClientConnections.push(peer_js_connection.Peer.connect(PeerJsEvent.CLIENT_CONNECT.event_data));
		} else if (event === PeerJsEvent.HOST_CONNECT) {
			console.debug("Host connected.");
		} else if (event === PeerJsEvent.MESSAGE) {
			if (typeof this.MessageHandler === "function") {
				this.MessageHandler(PeerJsEvent.MESSAGE.event_data.content, PeerJsEvent.MESSAGE.event_data.sender);
			} else {
				console.warn("No message handler registered!");
			}
		} else if (typeof this.CustomEventHandler === "function") {
			this.CustomEventHandler(event);
		}
	}

	RegisterHost(session_id) {
		const peer_js_connection = this;
		const id = this.Peer.id;

		if (id === null) {
			setTimeout(this.RegisterHost, 100);
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
		console.debug(data);

		jQuery.post("https://towerofawesome.org/signal_manager/", data)
			.done(payload => {
				payload = JSON.parse(payload);
				if (payload.result === 0) {
					console.debug(payload);
					peer_js_connection.IsHost = true;
				} else {
					console.error(payload);
				}
			})
			.fail(payload => {
				console.error(payload);
			})
	}

	ConnectToHost(session_id) {
		const id = this.Peer.id;

		if (id === null) {
			setTimeout(this.ConnectToHost, 100);
			return;
		}

		const data = {
			mode: "connect_client",
			session_id: session_id
		}
		console.debug(data);

		jQuery.post("https://towerofawesome.org/signal_manager/", data)
			.done(payload => {
				/** @var {{ result:int, msg:string, data:{ host_peer_id:string }}} */
				payload = JSON.parse(payload);
				if (payload.result === 0) {
					console.debug(payload);
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