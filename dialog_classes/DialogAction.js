
class DialogAction extends Dialog {
	TitleElement
	ContainerElement

	ButtonSubmit
	ButtonCancel

	CurrentAction

	constructor(selector_or_element, options = {}) {
		super(selector_or_element, options);
		this.TitleElement = this.DialogElement.querySelector("#dialog_action_title");
		this.ContainerElement = this.DialogElement.querySelector("#dialog_action_fields");
		this.ButtonSubmit = this.DialogElement.querySelector("#dialog_action_go");
		this.ButtonCancel = this.DialogElement.querySelector("#dialog_action_cancel");

		this.ButtonSubmit.addEventListener("click", () => {
			this.Save();
		})
		this.ButtonCancel.addEventListener("click", () => {
			this.Close();
		})
	}

	/**
	 * @param {{ label:string, [icon]:string, key:string, fields:string[], action:function(character:Character, fields:object) }} action
	 */
	Open(action) {
		this.CurrentAction = action;
		this.TitleElement.innerText = action.label;
		this.ContainerElement.innerHTML = "";
		action.fields.forEach((field) => {
			const split = field.split(":");
			const row = document.createElement("tr");
			this.ContainerElement.appendChild(row);

			const cell1 = document.createElement("td");
			row.appendChild(cell1);

			const label = document.createElement("label");
			label.innerText = split[0];
			cell1.appendChild(label);

			const cell2 = document.createElement("td");
			row.appendChild(cell2);

			const input = document.createElement("input");
			input.setAttribute("label", split[0]);
			input.className = "action_field field-input";
			input.type = split[1];
			cell2.appendChild(input);
		})
		super.Open();
	}

	Save() {
		const fields = Array.from(this.ContainerElement.querySelectorAll(".action_field"));
		console.debug(fields);
		let values = {}
		fields.forEach((field) => {
			const label = field.getAttribute("label");
			values[label] = field.value;
		})
		this.CurrentAction.action(characters[0], values);
		this.Close();
	}
}