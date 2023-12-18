class Character {
	/** @var {string} */
	Name
	/** @var {FieldGroup[]} */
	Fields
	/** @var {FieldGroup[]} */
	FieldsCustom
	/** @var {{ name:string, fields:string[] }[]} PinGroups
	 * May contain any number of groups with an array of fields.
	 * Group names can be anything, but two core groups may be used: `status` which is used to display character status indicators
	 * such as health, and `info` which is used to display character information such as race, class, and similar. */
	PinGroups
	/** @var {Inventory} */
	CharacterInventory

	/** @var {Date} */
	LastSync
	/** @var {{ key, Field }} */
	KeyFields

	/**
	 * @param {string} name
	 * @param {{ fields:FieldGroup[], pin_groups:{} }} options
	 */
	constructor(name, options = {}) {
		this.Name = name;
		this.Fields = options.fields || active_ruleset.CharacterFields;
		let inv_size = active_ruleset.InventorySize(session, this);
		this.CharacterInventory = new Inventory("Backpack", { sectors: inv_size });
		this.PinGroups = options.pin_groups || [];
		this.LastSync = new Date();

		this.KeyFields = {};
		this.Fields.forEach((group) => {
			group.Fields.forEach((field) => {
				let items = Character.#GetKeyAndField(field);
				for (let key in items) {
					this.KeyFields[key] = items[key];
				}
			});
		});
	}

	static #GetKeyAndField(field) {
		let items = {};
		if (field.hasOwnProperty("Key") && field.Key !== null)
			items[field.Key] = field;
		if (field.SubField != null) {
			let sub_items = this.#GetKeyAndField(field.SubField);
			for (let key in sub_items) {
				items[key] = sub_items[key];
			}
		}
		return items;
	}

	toString() {
		return this.Name;
	}

	Sync(name, level, health, fields, pin_groups) {
		this.Name = name;
		this.Level = level;
		this.Health = health;
		this.Fields = fields;
		this.PinGroups = pin_groups;
		this.LastSync = new Date();
	}

	GetQuickSheetElement() {
		let container = document.createElement("div");

		let name = document.createElement("div");
		name.innerText = this.Name;
	}

	/**
	 * @param {string|{ name:string, level:int, health:{ max:int, current:int }, fields:FieldGroup[], fields_custom:FieldGroup[], pinned:{ name:string, fields:string[]}[] }} json
	 * @constructor
	 */
	LoadJSON(json) {
		if (typeof json === "string")
			json = JSON.parse(json);
		this.Name = json.name;
		this.Level = json.level;
		this.Health = new CharacterHealth(json.health.max, json.health.current);
		this.Fields = json.fields;
		this.FieldsCustom = json.fields_custom;
		this.PinGroups = json.pinned;
	}

	GetJSON() {
		return JSON.stringify({
			name: this.Name,
			level: this.Level,
			health: this.Health,
			fields: this.Fields,
			fields_custom: this.FieldScustom,
			pinned: this.PinGroups
		});
	}

	Delete() {
		let index = characters.indexOf(this);
		characters.splice(index, 1);
	}

	/**
	 *
	 * @param {Field} field
	 * @returns {{ name:string, fields:string[] }|null}
	 * @constructor
	 */
	GetFieldPinGroup(field) {
		let val = null;
		this.PinGroups.forEach((group) => {
			group.fields.forEach((f) => {
				if (field.Label === f)
					val = group;
			})
		})
		return val;
	}

	/**
	 * @param {Field} field
	 * @return {string|null}
	 */
	GetFieldPinGroupName(field) {
		let group = this.GetFieldPinGroup(field);
		if (group !== null)
			return group.name;
		return null;
	}

	/**
	 *
	 * @param {Field} field
	 */
	#CreateColumns(field) {
		let col1 = document.createElement("td");
		col1.innerText = field.Label;
		let col2 = document.createElement("td");
		col2.appendChild(field.GetInput());
		return [col1, col2];
	}

	GetCompactElement(update_target = null) {
		let name;
		let info;
		let status;
		let fields;
		if (update_target == null) {
			update_target = document.createElement("div");
			update_target.classList.add("character_compact");
			update_target.id = "character_" + this.Name.toLowerCase();

			let control_container = document.createElement("div");
			control_container.classList.add("control_container");
			update_target.appendChild(control_container);

			let open = document.createElement("div");
			open.classList.add("open_sheet");
			open.title = "Open sheet";
			open.onclick = () => { dialog_character_sheet.Open(this) };
			control_container.appendChild(open);

			let del = document.createElement("div");
			del.classList.add("delete_character");
			del.title = "Delete character";
			let character = this;
			function delete_me() {
				character.Delete();
				update_target.parentElement.removeChild(update_target);
			}
			del.onclick = () => {
				dialog_confirm.Open("Really delete <span style='color: red;'>" + this.Name + "</span>?", [{ label: "Yes", color: "danger", callback: delete_me }, { label: "No", color: "success" }])
			}
			control_container.appendChild(del);

			name = document.createElement("div");
			name.classList.add("name");
			update_target.appendChild(name);

			info = document.createElement("div");
			info.classList.add("character_info");
			update_target.appendChild(info);

			status = document.createElement("div");
			status.classList.add("character_status");
			update_target.appendChild(status);

			fields = document.createElement("table");
			fields.classList.add("character_fields");
			update_target.appendChild(fields);
		} else {
			name = update_target.querySelector(".name");
			info = update_target.querySelector(".character_info");
			status = update_target.querySelector(".character_status");
			fields = update_target.querySelector(".character_fields");
		}

		/** @var {Field[]} */
		let info_fields = [];
		/** @var {Field[]} */
		let status_fields = [];
		/** @var {FieldGroup[]} */
		let custom_groups = [];

		this.Fields.forEach((group) => {
			group.Fields.forEach((field) => {
				const group = this.GetFieldPinGroup(field);
				if (group !== null) {
					if (group.name === "info")
						info_fields.push(field);
					else if (group.name === "status")
						status_fields.push(field);
				}
			});
		});
		console.debug(info_fields, status_fields, custom_groups);

		info.innerHTML = "";
		info_fields.forEach((field) => {
			info.appendChild(field.GetField());
		});

		status.innerHTML = "";
		status_fields.forEach((field) => {
			status.appendChild(field.GetField());
		})

		name.innerText = this.Name;
		fields.innerHTML = "";
		let row;
		let grp1 = false;
		custom_groups.forEach((group) => {
			let split = document.createElement("tr");
			fields.appendChild(split);

			let header = document.createElement("th");
			header.setAttribute("colspan", "99");
			header.innerText = group.Label;
			split.appendChild(header);

			group.Fields.forEach((field) => {
				if (this.FieldIsPinned(field, current_pin_group)) {
					if (row == null) {
						row = document.createElement("tr");
						fields.appendChild(row);
					}
					if (grp1) {
						let cols = this.#CreateColumns(field);
						row.appendChild(cols[0]);
						row.appendChild(cols[1]);
						grp1 = true;
					} else {
						let cols = this.#CreateColumns(field);
						row.appendChild(cols[0]);
						row.appendChild(cols[1]);
						grp1 = false;
						row = null;
					}
				}
			})
		});
		if (fields.children.length === 0) {
			let notice = document.createElement("div");
			notice.innerText = "No pinned fields.";
			notice.style.padding = "10px";
			notice.style.fontSize = "18pt";
			fields.appendChild(notice);
		}

		return update_target;
	}
}