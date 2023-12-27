
class PopoutElement {
	Container
	Callbacks

	Target


	/**
	 * @param {HTMLElement|string} element_or_selector
	 * @param {{ [text]:string, [html]:string, [elements]:HTMLElement[], [callbacks]:{ [show]:function } }} [options]
	 */
	constructor(element_or_selector, options = {}) {
		const popout = document.createElement("div");
		popout.classList.add("popout_element");
		document.body.appendChild(popout);
		this.Container = popout;

		// if (typeof element_or_selector === "string")
		// 	this.Container = document.querySelector(element_or_selector);
		// else
		// 	this.Container = element_or_selector;
		// this.Container.classList.add("popout_element");
		this.SetContent(options);

		if (typeof options.callbacks !== "undefined")
			this.Callbacks = options.callbacks;

		this.Container.addEventListener("click", (event) => {
			event.stopPropagation();
		})
		document.body.addEventListener("click", () => {
			this.Hide();
		})
	}

	/**
	 * @param {{ [text]:string, [html]:string, [elements]:HTMLElement[] }} options
	 */
	SetContent(options = {}) {
		if (typeof options.html !== "undefined" && options.html !== null)
			this.Container.innerHTML = options.html;
		else if (typeof options.text !== "undefined" && options.text !== null)
			this.Container.innerText = options.text;
		else if (Array.isArray(options.elements)) {
			this.Container.innerHTML = "";
			options.elements.forEach((element) => {
				this.Container.appendChild(element);
			})
		}
	}

	/**
	 * @param {{ [event]:MouseEvent, [position]:{ x:number, y:number }}} [options]
	 */
	SetPosition(options = {}) {
		let x = 0;
		let y = 0;
		if (typeof options.event !== "undefined" && options.event !== null) {
			// console.debug(options.event);
			options.position = {};
			options.position.x = options.event.clientX;
			options.position.y = options.event.clientY;
		}
		let offset_top = 0;
		let offset_left = 0;
		const dialog = Dialog.GetLastActiveDialog();
		if (dialog !== null) {
			offset_top = dialog.DialogElement.offsetTop;
			offset_left = dialog.DialogElement.offsetLeft;
		}

		this.Container.style.top = (options.position.y - offset_top + 10) + "px";
		this.Container.style.left = (options.position.x - offset_left + 10) + "px";
		if (Dialog.ActiveDialogs.length > 0)
			Dialog.ActiveDialogs[Dialog.ActiveDialogs.length - 1].DialogElement.appendChild(this.Container);
		else
			document.body.appendChild(this.Container);
	}

	/**
	 * @param {{ [event]:MouseEvent, [position]:{ x:number, y:number }, [text]:string, [html]:string, [elements]:HTMLElement[], [target]:* }} [options]
	 */
	Show(options = {}) {
		this.SetPosition(options);
		this.SetContent(options);
		if (typeof options.target !== "undefined")
			this.Target = options.target;
		this.Container.style.display = "block";
		if (this.Callbacks !== null && this.Callbacks.hasOwnProperty("show")) {
			this.Callbacks.show();
		}
	}

	Hide() {
		this.Container.style.display = null;
	}
}