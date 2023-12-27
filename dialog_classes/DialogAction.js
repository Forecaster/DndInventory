
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
	 * @param {{ label:string, [icon]:string, key:string, fields:{ label:string, [show_label]:boolean, items:string[] }[], action:function(character:Character, fields:object) }} action
	 */
	Open(action) {
		this.CurrentAction = action;
		this.TitleElement.innerText = action.label;
		this.ContainerElement.innerHTML = "";
		action.fields.forEach((field_group) => {
			const group_label = field_group.label;
			const show_label = field_group.show_label ?? true;
			const group = document.createElement("div");
			group.className = "action-group";
			group.setAttribute("group-label", group_label);
			this.ContainerElement.appendChild(group);

			if (show_label) {
				const label = document.createElement("div");
				label.className = "action-group-label";
				label.innerText = group_label;
				group.appendChild(label);
			}

			field_group.items.forEach((field) => {
				const split = field.split(":");
				const field_label = split[0];
				const field_type = split[1];
				const row = document.createElement("tr");
				group.appendChild(row);

				const cell1 = document.createElement("td");
				row.appendChild(cell1);

				const label = document.createElement("label");
				label.innerText = field_label;
				cell1.appendChild(label);

				const cell2 = document.createElement("td");
				row.appendChild(cell2);

				if (field_type === "character") {
					const select = document.createElement("select");
					select.setAttribute("label", field_label);
					select.className = "action_field field-input";
					cell2.appendChild(select);

					for (let i = 0; i < characters.length; i++) {
						const character = characters[i];
						const opt = document.createElement("option");
						opt.innerText = character.Name
						opt.value = i.toString();
						select.appendChild(opt);
					}
				} else {
					const input = document.createElement("input");
					input.setAttribute("label", field_label);
					input.className = "action_field field-input";
					input.type = field_type;
					cell2.appendChild(input);
				}
			})
		})
		super.Open();
	}

	Save() {
		const groups = Array.from(this.ContainerElement.querySelectorAll(".action-group"));
		const group_values = {};
		groups.forEach((group) => {
			const fields = Array.from(group.querySelectorAll(".action_field"));
			let values = {}
			fields.forEach((field) => {
				const label = field.getAttribute("label");
				values[label] = field.value;
			})
			group_values[group.getAttribute("group-label")] = values;
		})
		const result = this.CurrentAction.action(characters[0], group_values);
		if (result)
			this.Close();
	}
}