
class Dialog {
	/** @var {HTMLDialogElement} */
	DialogElement
	/** @var {HTMLElement[]} */
	ButtonsOpen
	/** @var {HTMLElement[]} */
	ButtonsClose
	/** @var {HTMLElement[]} */
	ButtonsSave
	/** @var {HTMLElement[]} */
	ButtonsSaveClose
	/** @var {HTMLElement[]} */
	Fields

	/** @var {function} */
	PreOpenAction
	/** @var {function} */
	PostOpenAction
	/** @var {function} */
	PreCloseAction
	/** @var {function} */
	PostCloseAction

	static ActiveDialogs = [];

	static GetLastActiveDialog() {
		if (this.ActiveDialogs.length > 0)
			return this.ActiveDialogs[this.ActiveDialogs.length - 1];
		return null;
	}

	static #CheckProperty(object, property) {
		return object !== null && object.hasOwnProperty(property) && object[property] !== null && object[property].hasOwnProperty("length");
	}

	/**
	 * @param {HTMLElement|string} selector_or_element
	 * @param {{ [external_buttons]: { [open]:(HTMLElement|string)[], [close]:(HTMLElement|string)[],
	 * [save]:(HTMLElement|string)[], [save_close]:(HTMLElement|string)[] }, [enter_submits]:boolean,
	 * [pre_open]:function, [post_open]:function, [pre_close]:function, [post_close]:function }} [options]
	 */
	constructor(selector_or_element, options = {}) {
		if (typeof selector_or_element === "string")
			this.DialogElement = document.querySelector(selector_or_element);
		else if (selector_or_element instanceof HTMLElement)
			this.DialogElement = selector_or_element
		if (typeof this.DialogElement === "undefined" || this.DialogElement === null) {
			console.warn("Invalid element or selector", selector_or_element);
			return null;
		}
		this.PreOpenAction = options.pre_open ?? null;
		this.PostOpenAction = options.post_open ?? null;
		this.PreCloseAction = options.pre_close ?? null;
		this.PostCloseAction = options.post_close ?? null;

		let external_buttons = options.external_buttons ?? {};

		let buttons_open = [];
		let buttons_close = [];
		let buttons_save = [];
		let buttons_save_close = [];

		if (external_buttons !== null) {
			if (Dialog.#CheckProperty(external_buttons, "open")) {
				external_buttons.open.forEach((element_or_identifier) => {
					if (typeof element_or_identifier === "string")
						buttons_open.push(document.querySelector(element_or_identifier));
					else if (element_or_identifier instanceof HTMLElement)
						buttons_open.push(element_or_identifier);
				})
			}
			if (Dialog.#CheckProperty(external_buttons, "close")) {
				external_buttons.close.forEach((element_or_identifier) => {
					if (typeof element_or_identifier === "string")
						buttons_open.push(document.querySelector(element_or_identifier));
					else if (element_or_identifier instanceof HTMLElement)
						buttons_open.push(element_or_identifier);
				})
			}
			if (Dialog.#CheckProperty(external_buttons, "save")) {
				external_buttons.save.forEach((element_or_identifier) => {
					if (typeof element_or_identifier === "string")
						buttons_open.push(document.querySelector(element_or_identifier));
					else if (element_or_identifier instanceof HTMLElement)
						buttons_open.push(element_or_identifier);
				})
			}
			if (Dialog.#CheckProperty(external_buttons, "save_close")) {
				external_buttons.save_close.forEach((element_or_identifier) => {
					if (typeof element_or_identifier === "string")
						buttons_open.push(document.querySelector(element_or_identifier));
					else if (element_or_identifier instanceof HTMLElement)
						buttons_open.push(element_or_identifier);
				})
			}
		}

		buttons_open = buttons_open.concat(Array.from(this.DialogElement.querySelectorAll(".open_button")));
		buttons_close = buttons_close.concat(Array.from(this.DialogElement.querySelectorAll(".close_button")));
		buttons_save = buttons_save.concat(Array.from(this.DialogElement.querySelectorAll(".save_button")));
		buttons_save_close = buttons_save_close.concat(Array.from(this.DialogElement.querySelectorAll(".save_close_button")));

		this.ButtonsOpen = buttons_open;
		this.ButtonsClose = buttons_close;
		this.ButtonsSave = buttons_save;
		this.ButtonsSaveClose = buttons_save_close;

		buttons_open.forEach((button) => {
			this.ButtonApplyOnClickOpen(button);
		});
		buttons_close.forEach((button) => {
			this.ButtonApplyOnClickClose(button);
		})
		buttons_save.forEach((button) => {
			this.ButtonApplyOnClickSave(button);
		})
		buttons_save_close.forEach((button) => {
			this.ButtonApplyOnClickSaveClose(button);
		})
	}

	//<editor-fold desc="Utility methods">
	ButtonApplyOnClickOpen(button) {
		button.onclick = () => {
			this.Open();
		};
	}
	ButtonApplyOnClickClose(button) {
		button.onclick = () => {
			this.Close();
		}
	}
	ButtonApplyOnClickSave(button) {
		button.onclick = () => {
			this.Save();
		}
	}
	ButtonApplyOnClickSaveClose(button) {
		button.onclick = () => {
			this.SaveClose();
		}
	}

	AddButtonOpen(button) {
		this.ButtonsOpen.push(button);
		this.ButtonApplyOnClickOpen(button);
	}

	AddButtonClose(button) {
		this.ButtonsClose.push(button);
		this.ButtonApplyOnClickClose(button);
	}

	AddButtonSave(button) {
		this.ButtonsSave.push(button);
		this.ButtonApplyOnClickSave(button);
	}

	AddButtonSaveClose(button) {
		this.ButtonsSaveClose.push(button);
		this.ButtonApplyOnClickSaveClose(button);
	}

	/**
	 * @param {HTMLInputElement[]} inputs
	 * @param {{ [test_function]:function, [all_succeed]:boolean }} options
	 */
	CheckInputs(inputs, options = {}) {
		let all_succeed = options.all_succeed ?? true;
		let test = options.test_function ?? function(element) { return element.value.length >= 1 };
		let successes = 0;
		inputs.forEach((input) => {
			if (typeof test === "function") {
				if (test(input))
					successes += 1;
			}
		})
		if (all_succeed && successes === inputs.length)
			return true;
		else if (!all_succeed && successes >= 1)
			return true;
		return false;
	}
	//</editor-fold>

	OnKeyDown(self, event) {
		if (event.key === "Enter") {
			self.Save();
		}
	}

	Open() {
		if (typeof this.PreOpenAction === "function")
			this.PreOpenAction();
		this.DialogElement.showModal();
		Dialog.ActiveDialogs.push(this);
		if (typeof this.PostOpenAction === "function")
			this.PostOpenAction();
	}

	Close() {
		if (typeof this.PreCloseAction === "function")
			this.PreCloseAction();
		this.DialogElement.close();
		const index = Dialog.ActiveDialogs.indexOf(this);
		if (index >= 0)
			Dialog.ActiveDialogs.splice(index, 1);
		if (typeof this.PostCloseAction === "function")
			this.PostCloseAction();
	}

	Save() {}

	SaveClose() {
		this.Save();
		this.Close();
	}
}