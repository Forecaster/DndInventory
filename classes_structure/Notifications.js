
class Notifications {

	/** @var {HTMLElement} */
	Container

	HideTimer

	MessageByID

	/**
	 * @param {string|HTMLElement} element_or_selector
	 */
	constructor(element_or_selector) {
		const link = document.createElement("link");
		link.rel = "stylesheet";
		link.href = "styles/notifications.css";
		document.head.appendChild(link);
		if (typeof element_or_selector === "string")
			this.Container = document.querySelector(element_or_selector);
		else
			this.Container = element_or_selector;
		this.Container.setAttribute("popover", "manual");
		this.MessageByID = {};
	}

	Clear() {
		this.Container.innerHTML = "";
	}

	/**
	 * This method "shifts" the notification container. This removes and re-adds it to the #top-layer to place it above other things in the top layer.
	 * This should be done after for example opening a dialog (can be done by adding a PostOpen function to the dialog instance, see Dialog constructor options).
	 */
	Shift() {
		this.Container.hidePopover();
		setTimeout(() => {
			this.Container.showPopover();
		}, 10);
	}

	/**
	 * @param {string} msg
	 * @param {{ [duration]:number|null, [type]:"info"|"success"|"warning"|"error", [id]:string, [sender]:string }} [options]
	 * `id` may be a custom id assigned to the message. This id can be used with `RemoveMessageByID` to clear the message before the timer expires.
	 */
	Send(msg, options = {}) {
		const duration = options.duration ?? 5;
		const type = options.type ?? "info";
		const id = options.id ?? null;
		const sender = options.sender ?? null;

		const element = document.createElement("div");

		if (sender !== null) {
			const sender_element = document.createElement("div");
			sender_element.classList.add("notification_sender");
			sender_element.innerText = sender;
			element.appendChild(sender_element);
			console.debug(sender_element);
		}

		element.classList.add("notification", type);
		if (duration > 0) {
			element.style.animationDelay = `${duration}s`;
			element.classList.add("notification-fade");
		}
		const msg_element = document.createElement("div");
		msg_element.innerHTML = msg;
		element.appendChild(msg_element);
		element.addEventListener("click", (event) => {
			this.Container.removeChild(element);
		})
		if (id !== null) {
			this.MessageByID[id] = element;
		}
		this.Container.appendChild(element);
		this.Container.showPopover();
		if (duration > 0) {
			setTimeout(() => {
				try {
					this.Container.removeChild(element);
				} catch (e) {}
			}, (duration * 1000) + 5100);
		}
	}

	/**
	 * @param {string} msg
	 * @param {{ [duration]:number, [type]:"info"|"success"|"warning"|"error", [id]:string, [sender]:string }} [options]
	 * `id` may be a custom id assigned to the message. This id can be used with `RemoveMessageByID` to clear the message before the timer expires.
	 */
	Success(msg, options = {}) {
		options.type = "success";
		this.Send(msg, options);
	}

	/**
	 * @param {string} msg
	 * @param {{ [duration]:number, [type]:"info"|"success"|"warning"|"error", [id]:string, [sender]:string }} [options]
	 * `id` may be a custom id assigned to the message. This id can be used with `RemoveMessageByID` to clear the message before the timer expires.
	 */
	Error(msg, options = {}) {
		options.type = "error";
		if (!options.hasOwnProperty("duration"))
			options.duration = 0;
		this.Send(msg, options);
	}

	/**
	 * @param {string} msg
	 * @param {{ [duration]:number, [type]:"info"|"success"|"warning"|"error", [id]:string, [sender]:string }} [options]
	 * `id` may be a custom id assigned to the message. This id can be used with `RemoveMessageByID` to clear the message before the timer expires.
	 */
	Warning(msg, options = {}) {
		options.type = "warning";
		this.Send(msg, options);
	}

	/**
	 * @param {string} msg
	 * @param {{ [duration]:number, [type]:"info"|"success"|"warning"|"error", [id]:string, [sender]:string }} [options]
	 * `id` may be a custom id assigned to the message. This id can be used with `RemoveMessageByID` to clear the message before the timer expires.
	 */
	Info(msg, options = {}) {
		options.type = "info";
		this.Send(msg, options);
	}

	Dice(msg, options = {}) {
		options.type = "dice";
		this.Send(msg, options);
	}

	RemoveMessageByID(id) {
		if (typeof this.MessageByID[id] !== "undefined" && this.MessageByID[id] !== null) {
			const element = this.MessageByID[id];
			element.parentElement.removeChild(element);
			delete this.MessageByID[id];
		}
	}
}