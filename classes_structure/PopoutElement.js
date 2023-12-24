
class PopoutElement {
	Container
	Callbacks

	Target


	/**
	 * @param {HTMLElement|string} element_or_selector
	 * @param {{ [text]:string, [html]:string, [elements]:HTMLElement[], [callbacks]:{ [show]:function } }} [options]
	 */
	constructor(element_or_selector, options = {}) {
		if (typeof element_or_selector === "string")
			this.Container = document.querySelector(element_or_selector);
		else
			this.Container = element_or_selector;
		this.Container.classList.add("popout_element");
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
			options.position = {};
			options.position.x = options.event.clientX;
			options.position.y = options.event.clientY;
		}
		this.Container.style.top = options.position.y + "px";
		this.Container.style.left = options.position.x + "px";
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