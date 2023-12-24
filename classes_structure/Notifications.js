
class Notifications {

	/** @var {HTMLElement} */
	Container

	HideTimer

	MessageByID

	/**
	 * @param {string|HTMLElement} element_or_selector
	 */
	constructor(element_or_selector) {
		if (typeof element_or_selector === "string")
			this.Container = document.querySelector(element_or_selector);
		else
			this.Container = element_or_selector;
		this.Container.setAttribute("popover", "manual");
		this.MessageByID = {};
	}

	/**
	 * @param {string} msg
	 * @param {{ [duration]:number, [type]:"info"|"success"|"warning"|"error", [id]:string }} [options]
	 * `id` may be a custom id assigned to the message. This id can be used with `RemoveMessageByID` to clear the message before the timer expires.
	 * @constructor
	 */
	Send(msg, options = {}) {
		const duration = options.duration ?? 5;
		const type = options.type ?? "info";
		const id = options.id ?? null;

		let element = document.createElement("div");
		element.style.animationDelay = `${duration}s`;
		element.classList.add("notification", type);
		element.innerText = msg;
		if (id !== null) {
			this.MessageByID[id] = element;
		}
		this.Container.appendChild(element);
		this.Container.showPopover();
		setTimeout(() => {
			try {
				this.Container.removeChild(element);
			} catch (e) {}
		}, (duration * 1000) + 5100);
	}

	Success(msg, options = {}) {
		options.type = "success";
		this.Send(msg, options);
	}

	Error(msg, options = {}) {
		options.type = "error";
		this.Send(msg, options);
	}

	Warning(msg, options = {}) {
		options.type = "warning";
		this.Send(msg, options);
	}

	Info(msg, options = {}) {
		options.type = "info";
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