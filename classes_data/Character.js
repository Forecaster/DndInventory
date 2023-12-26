class Character extends Serializable {
	/** @var {string} */
	ID
	/** @var {string} */
	Name
	/** @var {string} */
	Owner
	/** @var {FieldGroup[]} */
	_FieldGroups
	get FieldGroups() {
		return this._FieldGroups;
	}
	set FieldGroups(v) {
		const root = this;
		this._FieldGroups = v;
		this._FieldGroups._push = this._FieldGroups.push;
		this._FieldGroups.push = function(...items) {
			items.forEach((item) => {
				root._FieldGroups._push(item);
				item.AddParent(root);
			});
		}
		this._FieldGroups.forEach((field) => {
			field.AddParent(this);
		})
	}
	/** @var {FieldGroup[]} */
	FieldsGroupsCustom
	/** @var {{ name:string, fields:string[] }[]} PinGroups
	 * May contain any number of groups with an array of fields.
	 * Group names can be anything, but two core groups may be used: `status` which is used to display character status indicators
	 * such as health, and `info` which is used to display character information such as race, class, and similar. */
	PinGroups
	/** @var {Inventory} */
	CharacterInventory
	/** @var {string} */
	Notes

	/** @var {Number} */
	UploadTimer
	/** @var {Date} */
	LastSync
	/** @var {{ key, Field }} */
	KeyFields

	/**
	 * @param {string} name
	 * @param {{ [id]:string|null, [owner]:string|null, [fields]:FieldGroup[], [notes]:string, [pin_groups]:{ name:string, fields:string[] }[] }} [options]
	 */
	constructor(name, options = {}) {
		super();
		this.Name = name;
		this.ID = options.id ?? null;
		this.Owner = options.owner ?? null;
		this.FieldGroups = options.fields ?? [];
		this.PinGroups = options.pin_groups ?? [];
		this.LastSync = new Date();
		this.Notes = options.notes ?? "";

		this.KeyFields = {};
		this.FieldGroups.forEach((group) => {
			group.Fields.forEach((field) => {
				let items = Character.#GetKeyAndField(field);
				for (let key in items) {
					this.KeyFields[key] = items[key];
				}
			});
		});
	}

	/**
	 * @param {Ruleset} ruleset
	 */
	SetFromRuleset(ruleset) {
		this.FieldGroups = ruleset.CharacterFields;
	}

	toString() {
		return this.Name;
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

	GetQuickSheetElement() {
		let container = document.createElement("div");

		let name = document.createElement("div");
		name.innerText = this.Name;
	}

	Delete() {
		const data = { session_id: session.ID, token: session.Token, character_id: this.ID, player: session.CurrentUsername };
		API.Call("character_delete", {
			data: data,
			success: (payload) => {
				console.debug(payload);
				let index = characters.indexOf(this);
				characters.splice(index, 1);
			}
		})
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
		field.GetInput().forEach((element) => {
			col2.appendChild(element);
		});
		return [col1, col2];
	}

	/**
	 * @param {Field} field
	 * @param {string} label
	 * @param {Any} value
	 */
	static #SetField(field, label, value) {
		if (field.Label === label) {
			field.Value = value;
			field.Refresh();
			return true;
		} else if (Array.isArray(field.SubFields)) {
			let value = false;
			field.SubFields.forEach((sub_field) => {
				value = value || Character.#SetField(sub_field, label, value);
			})
			return value;
		}
		return false;
	}

	SetField(label, value) {
		let return_value = false;
		if (Array.isArray(this.FieldGroups)) {
			this.FieldGroups.forEach((group) => {
				group.Fields.forEach((field) => {
					if (Character.#SetField(field, label, value)) {
						this.PrimeUpload();
						return_value = true;
					}
				});
			});
		}
		if (!return_value)
			console.warn(`Failed to find field '${label}' to update in current character.`, this);
		return return_value;
	}

	GetField(label, default_value = null) {
		let value = default_value;
		if (Array.isArray(this.FieldGroups)) {
			this.FieldGroups.forEach((group) => {
				group.Fields.forEach((field) => {
					if (field.Label === label)
						value = field.Value;
				});
			});
		}
		return value;
	}

	GetCompactElement(update_target = null) {
		let field_update_timer = null;
		let field_update_function = null;
		let field_update_field = null;
		const callback_keydown = (event) => {
			clearTimeout(field_update_timer);
			const field = event.target.getAttribute("field-label");
			if (field_update_function !== null && field_update_field !== field)
				field_update_function();
			field_update_field = field;
			field_update_function = () => {
				if (typeof field !== "undefined" && field !== null)
					this.SetField(field, event.target.value.trim());
			};
			field_update_timer = setTimeout(field_update_function, 500);
		};

		let character = this;
		let name;
		let info;
		let status;
		let fields;
		if (update_target == null) {
			update_target = document.createElement("div");
			update_target.classList.add("character_compact");
			update_target.id = `character_${this.Name.toLowerCase()}`;
			update_target.addEventListener("keydown", callback_keydown);

			let control_container = document.createElement("div");
			control_container.classList.add("control_container");
			update_target.appendChild(control_container);

			let notes = document.createElement("div");
			notes.classList.add("character_notes");
			notes.title = "Character notes";
			notes.onclick = (event) => {
				event.stopPropagation();
				popout_character_notes.Show({ event: event, target: character });
			}
			control_container.appendChild(notes);

			let open = document.createElement("div");
			open.classList.add("open_sheet");
			open.title = "Open sheet";
			open.onclick = () => { dialog_character_sheet.Open(this) };
			control_container.appendChild(open);

			let del = document.createElement("div");
			del.classList.add("delete_character");
			del.title = "Delete character";
			function delete_me() {
				character.Delete();
				update_target.parentElement.removeChild(update_target);
			}
			del.onclick = () => {
				dialog_confirm.Open(`Really delete <span style='color: red;'>${this.Name}</span>?`, [{ label: "Yes", color: "danger", callback: delete_me }, { label: "No", color: "success" }])
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

		this.FieldGroups.forEach((group) => {
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

		info.innerHTML = "";
		info_fields.forEach((field) => {
			info.appendChild(field.GetField({ short_label: true }));
		});

		status.innerHTML = "";
		status_fields.forEach((field) => {
			status.appendChild(field.GetField({ short_label: true }));
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

		let owner = document.createElement("div");
		owner.innerText = `This character belongs to ${this.Owner ?? 'the GM'}`;
		update_target.appendChild(owner);

		return update_target;
	}

	Upload() {
		console.debug("Character upload", this);
		const data = { session_id: session.ID, player: session.CurrentUsername, token: session.Token, character_id: this.ID, character_data: this.Serialize() };
		API.Call("character_save", {
			data: data,
			success: (payload) => {
				if (this.ID === null || this.ID === "")
					this.ID = payload.data.id;
				notifications.Success(`Character '${this.Name}' saved!`);
			}
		})
	}

	PrimeUpload() {
		notifications.RemoveMessageByID("saving_character");
		notifications.Info(`Saving ${this.Name}...`, { id: "saving_character" });
		clearTimeout(this.UploadTimer);
		this.UploadTimer = setTimeout(() => {
			notifications.RemoveMessageByID("saving_character");
			this.Upload();
		}, 5 * 1000);
	}
}