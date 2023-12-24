
class DialogCharacterSheet extends Dialog {
	/** @var {HTMLDivElement} */
	FieldContainer

	/** @var {Character} */
	ActiveCharacter

	constructor(selector, options) {
		super(selector, options);
		this.FieldContainer = this.DialogElement.querySelector("#field_container");
	}

	/**
	 * @param {Character} character
	 * @constructor
	 */
	Open(character= null) {
		super.Open();
		this.ActiveCharacter = character;

		this.FieldContainer.innerHTML = "";

		character.FieldGroups.forEach((group) => {
			let table = document.createElement("table");
			this.FieldContainer.appendChild(table);

			let hr = document.createElement("tr");
			table.appendChild(hr);

			let cell = document.createElement("th");
			cell.className = "group_header";
			cell.setAttribute("colspan", "99");
			cell.innerText = group.Label;
			hr.appendChild(cell);

			group.Fields.forEach(field => {
				let row = document.createElement("tr");
				table.appendChild(row);

				let col1 = document.createElement("td");
				col1.appendChild(field.GetLabel());
				row.appendChild(col1);

				function keyup(event) {
					character.SetField(event.currentTarget.getAttribute("field-label"), event.currentTarget.value);
				}
				let col2 = document.createElement("td");
				row.appendChild(col2);
				field.AppendInput(col2, { callbacks: { onkeyup: keyup } });
			});
		});
	}
}