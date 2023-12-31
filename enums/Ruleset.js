
class Ruleset {
	/** @var {string} */
	ID
	/** @var {string} */
	Name
	/** @var {FieldGroup[]} */
	CharacterFields
	/** @var {{ name:string, fields:string[] }[]} */
	DefaultPins
	/** @var {{ label:string, icon:string, key:string, fields:{ label:string, [show_label]:boolean, items:string[] }[], action:function(character:Character, fields:object) }[]} */
	Actions
	/** @var {Object.<string, string>} DiceColors Should be an object with key value pairs where the key is the name of the preset and the value is a string containing a valid css color. */
	DiceColors
	/** @var {Function} */
	LevelFormula
	/** @var {Function} */
	MaxHitPointsFormula
	/** @var {Function} */
	InventorySizeFormula
	/** @var {Function} */
	EncumbranceOptions

	static Dnd5e = new Ruleset("Dnd5e", "D&D 5e", {
		encumbrance_options: [ 'Standard', 'Variant' ],
		character_fields: [
			new FieldGroup("Attributes",
				new FieldNumber("Strength", 			{ label_short: "Str", value: 10, key: "str", size: 2, sub_fields: [ new FieldNumber("Strength bonus", 			{ key: "str.b", formula: "floor(({str}-10)/2)", dice_formula: "d20 + {val}", size: 2 }), new FieldNumber("Strength Save",				{ key: "str.s", formula: "{str.b}+({prof}*{str.p})", dice_formula: "d20 + {val}", size: 2 }), new FieldNumber("Strength Save Proficiency", 			{ key: "str.p", size: 2, value: 0 }) ]}),
				new FieldNumber("Dexterity", 			{ label_short: "Dex", value: 10, key: "dex", size: 2, sub_fields: [ new FieldNumber("Dexterity bonus",			{ key: "dex.b", formula: "floor(({dex}-10)/2)", dice_formula: "d20 + {val}", size: 2 }), new FieldNumber("Dexterity Save",				{ key: "dex.s", formula: "{dex.b}+({prof}*{dex.p})", dice_formula: "d20 + {val}", size: 2 }), new FieldNumber("Dexterity Save Proficiency", 		{ key: "dex.p", size: 2, value: 0 }) ]}),
				new FieldNumber("Constitution", 	{ label_short: "Con", value: 10, key: "con", size: 2, sub_fields: [ new FieldNumber("Constitution bonus", 	{ key: "con.b", formula: "floor(({con}-10)/2)", dice_formula: "d20 + {val}", size: 2 }), new FieldNumber("Constitution Save",		{ key: "con.s", formula: "{con.b}+({prof}*{con.p})", dice_formula: "d20 + {val}", size: 2 }), new FieldNumber("Constitution Save Proficiency", 	{ key: "con.p", size: 2, value: 0 }) ]}),
				new FieldNumber("Intelligence", 	{ label_short: "Int", value: 10, key: "int", size: 2, sub_fields: [ new FieldNumber("Intelligence bonus", 	{ key: "int.b", formula: "floor(({int}-10)/2)", dice_formula: "d20 + {val}", size: 2 }), new FieldNumber("Intelligence Save",		{ key: "int.s", formula: "{int.b}+({prof}*{int.p})", dice_formula: "d20 + {val}", size: 2 }), new FieldNumber("Intelligence Save Proficiency", 	{ key: "int.p", size: 2, value: 0 }) ]}),
				new FieldNumber("Wisdom", 				{ label_short: "Wis", value: 10, key: "wis", size: 2, sub_fields: [ new FieldNumber("Wisdom bonus", 				{ key: "wis.b", formula: "floor(({wis}-10)/2)", dice_formula: "d20 + {val}", size: 2 }), new FieldNumber("Wisdom Save",					{ key: "wis.s", formula: "{wis.b}+({prof}*{wis.p})", dice_formula: "d20 + {val}", size: 2 }), new FieldNumber("Wisdom Save Proficiency", 				{ key: "wis.p", size: 2, value: 0 }) ]}),
				new FieldNumber("Charisma", 			{ label_short: "Cha", value: 10, key: "cha", size: 2, sub_fields: [ new FieldNumber("Charisma bonus", 			{ key: "cha.b", formula: "floor(({cha}-10)/2)", dice_formula: "d20 + {val}", size: 2 }), new FieldNumber("Charisma Save",				{ key: "cha.s", formula: "{cha.b}+({prof}*{cha.p})", dice_formula: "d20 + {val}", size: 2 }), new FieldNumber("Charisma Save Proficiency", 			{ key: "cha.p", size: 2, value: 0 }) ]}),
			),
			new FieldGroup("Skills",
				new FieldNumber("Acrobatics",				{key: "acrobatics",				dice_formula: "d20 + {val}", formula: "{acrobatics.p}*{prof}+{dex.b}", size: 4, sub_fields: [ new FieldNumber("Acrobatics Proficiency", {key: "acrobatics.p", min: 0, max: 2, size: 3}) ]}),
				new FieldNumber("Animal Handling", 	{key: "animal_handling", 	dice_formula: "d20 + {val}", formula: "{animal_handling.p}*{prof}+{wis.b}", size: 4, sub_fields: [ new FieldNumber("Animal Handling Proficiency", {key: "animal_handling.p", min: 0, max: 2, size: 3}) ]}),
				new FieldNumber("Arcana",						{key: "arcana",						dice_formula: "d20 + {val}", formula: "{arcana.p}*{prof}+{int.b}", size: 4, sub_fields: [ new FieldNumber("Arcana Proficiency", {key: "arcana.p", min: 0, max: 2, size: 3}) ]}),
				new FieldNumber("Athletics", 				{key: "athletics",					dice_formula: "d20 + {val}", formula: "{athletics.p}*{prof}+{str.b}", size: 4, sub_fields: [ new FieldNumber("Athletics Proficiency", {key: "athletics.p", min: 0, max: 2, size: 3}) ]}),
				new FieldNumber("Deception", 				{key: "deception",					dice_formula: "d20 + {val}", formula: "{deception.p}*{prof}+{cha.b}", size: 4, sub_fields: [ new FieldNumber("Deception Proficiency", {key: "deception.p", min: 0, max: 2, size: 3}) ]}),
				new FieldNumber("History", 					{key: "history",						dice_formula: "d20 + {val}", formula: "{history.p}*{prof}+{int.b}", size: 4, sub_fields: [ new FieldNumber("History Proficiency", {key: "history.p", min: 0, max: 2, size: 3}) ]}),
				new FieldNumber("Insight", 					{key: "insight",						dice_formula: "d20 + {val}", formula: "{insight.p}*{prof}+{wis.b}", size: 4, sub_fields: [ new FieldNumber("Insight Proficiency", {key: "insight.p", min: 0, max: 2, size: 3}) ]}),
				new FieldNumber("Intimidation", 		{key: "intimidation", 			dice_formula: "d20 + {val}", formula: "{intimidation.p}*{prof}+{cha.b}", size: 4, sub_fields: [ new FieldNumber("Intimidation Proficiency", {key: "intimidation.p", min: 0, max: 2, size: 3}) ]}),
				new FieldNumber("Investigation", 		{key: "investigation", 		dice_formula: "d20 + {val}", formula: "{investigation.p}*{prof}+{int.b}", size: 4, sub_fields: [ new FieldNumber("Investigation Proficiency", {key: "investigation.p", min: 0, max: 2, size: 3}) ]}),
				new FieldNumber("Medicine", 				{key: "medicine", 					dice_formula: "d20 + {val}", formula: "{medicine.p}*{prof}+{wis.b}", size: 4, sub_fields: [ new FieldNumber("Medicine Proficiency", {key: "medicine.p", min: 0, max: 2, size: 3}) ]}),
				new FieldNumber("Nature", 					{key: "nature", 						dice_formula: "d20 + {val}", formula: "{nature.p}*{prof}+{int.b}", size: 4, sub_fields: [ new FieldNumber("Nature Proficiency", {key: "nature.p", min: 0, max: 2, size: 3}) ]}),
				new FieldNumber("Perception", 			{key: "perception", 				dice_formula: "d20 + {val}", formula: "{perception.p}*{prof}+{wis.b}", size: 4, sub_fields: [ new FieldNumber("Perception Proficiency", {key: "perception.p", min: 0, max: 2, size: 3}) ]}),
				new FieldNumber("Performance", 			{key: "performance", 			dice_formula: "d20 + {val}", formula: "{performance.p}*{prof}+{cha.b}", size: 4, sub_fields: [ new FieldNumber("Performance Proficiency", {key: "performance.p", min: 0, max: 2, size: 3}) ]}),
				new FieldNumber("Persuasion", 			{key: "persuasion", 				dice_formula: "d20 + {val}", formula: "{persuasion.p}*{prof}+{cha.b}", size: 4, sub_fields: [ new FieldNumber("Persuasion Proficiency", {key: "persuasion.p", min: 0, max: 2, size: 3}) ]}),
				new FieldNumber("Religion", 				{key: "religion", 					dice_formula: "d20 + {val}", formula: "{religion.p}*{prof}+{int.b}", size: 4, sub_fields: [ new FieldNumber("Religion Proficiency", {key: "religion.p", min: 0, max: 2, size: 3}) ]}),
				new FieldNumber("Sleight of Hand", 	{key: "sleight_of_hand", 	dice_formula: "d20 + {val}", formula: "{sleight_of_hand.p}*{prof}+{dex.b}", size: 4, sub_fields: [ new FieldNumber("Sleight of Hand Proficiency", {key: "sleight_of_hand.p", min: 0, max: 2, size: 3}) ]}),
				new FieldNumber("Stealth", 					{key: "stealth", 					dice_formula: "d20 + {val}", formula: "{stealth.p}*{prof}+{dex.b}", size: 4, sub_fields: [ new FieldNumber("Stealth Proficiency", {key: "stealth.p", min: 0, max: 2, size: 3}) ]}),
				new FieldNumber("Survival", 				{key: "survival", 					dice_formula: "d20 + {val}", formula: "{survival.p}*{prof}+{wis.b}", size: 4, sub_fields: [ new FieldNumber("Survival Proficiency", {key: "survival.p", min: 0, max: 2, size: 3}) ]}),
				new FieldNumber("Thieves' Tools", 	{key: "thieves_tools", 		dice_formula: "d20 + {val}", formula: "{thieves_tools.p}*{prof}+{dex.b}", size: 4, sub_fields: [ new FieldNumber("Thieves' Tools Proficiency", {key: "thieves_tools.p", min: 0, max: 2, size: 3}) ]})
			),
			new FieldGroup("Misc",
				new FieldText("Race"),
				new FieldText("Class"),
				new FieldText("Alignment"),
				new FieldNumber("Level", { key: "level", size: 3 }),
				new FieldText("Background"),
				new FieldText("Proficiency Bonus", { key: "prof", size: 3 }),
				new FieldText("Walk speed"),
				new FieldText("Swim speed"),
				new FieldText("Fly speed"),
				new FieldText("Resistances", { key: "resist" }),
				new FieldText("Immunities", { key: "immune" }),
				new FieldText("Weaknesses", { key: "weak" }),
				new FieldNumber("Armor class", { label_short: "AC", key: "ac", size: 3 }),
				new FieldText("Hit dice count", { key: "hdc", size: 3 }),
				new FieldNumber("Hit dice size", { key: "hds", size: 3 }),
				new FieldNumber("Wounds", { label_short: "W", key: "wounds", size: 3, sub_fields: [ new FieldNumber("Hit points", { label_short: "Max", key: "hpmax", size: 3, formula: "" }) ], sub_field_divider: "/" }),
				new FieldNumber("Temporary Hit points", { label_short: "Temp. HP", key: "thp", size: 3 })
			) // TODO enable dice string results to be applied to another field, eg. `{prof} = d20 + {val}`
		],
		default_pins: [
			{name: "info", fields: [ "Race", "Class", "Background", "Proficiency Bonus", "Level" ]},
			{name: "status", fields: [ "Wounds", "Temporary Hit points", "Armor class" ]}
		],
		dice_colors: { poison: "#6cc926" },
		actions: [
			{ label: "Take damage", icon: "game-icons/carl-olsen/crossbow.png", key: "damage",
				fields: [
					{ label: "Data", show_label: false, items: [
						"Character:character",
						]},
					{ label: "Damage", items: [
						"Magical:number",
						"Acid:number",
						"Bludgeoning:number",
						"Cold:number",
						"Fire:number",
						"Force:number",
						"Lightning:number",
						"Necrotic:number",
						"Piercing:number",
						"Poison:number",
						"Psychic:number",
						"Radiant:number",
						"Slashing:number",
						"Thunder:number"
						]}
				], action: (character, fields) => {
					character = characters[fields['Data']['Character']];
					const msg_duration = 30;
					const resistant = character.GetFieldValueByLabel("Resistances", "");
					const immune = character.GetFieldValueByLabel("Immunities", "");
					const weak = character.GetFieldValueByLabel("Weaknesses", "");
					let total_damage = 0;
					for (let field in fields['Damage']) {
						const f = fields['Damage'][field];
						let starting_damage = parseFloat(f);
						let val = parseFloat(f);
						if (isNaN(val)) {
							val = 0;
						} else if (str_contains(immune, field)) {
							val = 0;
							notifications.Success(`${character.Name} completely resisted ${starting_damage} ${field} damage!`, { duration: msg_duration });
						} else if (str_contains(resistant, field)) {
							val = Math.floor(val * .5);
							if (val > 0)
								notifications.Success(`Resisted ${val} ${field} damage!`, { duration: msg_duration });
						} else if (str_contains(weak, field)) {
							val = Math.floor(val * 2);
							notifications.Error(`${character.Name} is weak against ${field}! Took ${val} ${field} damage!`);
						}
						total_damage += val;
					}
					console.debug(fields, total_damage);
					if (total_damage === 0)
						return;
					let temp_hp = character.GetFieldValueByLabel("Temporary Hit points", 0);
					console.debug("temp", temp_hp);
					let diff = temp_hp - total_damage;
					console.debug("diff", diff);
					if (diff >= 0) {
						character.SetField("Temporary Hit points", diff);
						notifications.Warning(`${character.Name} took ${total_damage} damage. Fully absorbed by temp. hit points.`, { duration: msg_duration });
					} else {
						character.SetField("Temporary Hit points", 0);
						diff *= -1;
						character.SetField("Wounds", parseFloat(character.GetFieldValueByLabel("Wounds", 0)) + diff);
						let extra = "";
						if (total_damage - diff > 0)
							extra = ` ${total_damage - diff} absorbed by temp. hit points.`;
						notifications.Error(`${character.Name} took ${total_damage} damage!` + extra, { duration: msg_duration });
					}
					let type = "info";
					const max = character.GetFieldValueByLabel("Hit Points");
					const rem = max - character.GetFieldValueByLabel("Wounds");
					const percent = rem / max;
					if (percent < .2)
						type = "error";
					else if (percent < .5)
						type = "warning";
					notifications.Send(`${character.Name} has ${rem} hit points left. (${Math.floor(percent*100)}%)`, { type: type, duration: msg_duration });
					return false;
				}},
			{ label: "Recover", icon: "", key: "recover", fields: [
				"Character:character",
				"Dice amount:number"
				], action: (character, fields) => {
					character = characters[fields['Character']];
				}}
		],
		/**
		 * @param {Ruleset} current_ruleset
		 * @param {Session} current_session
		 * @param {Character} character
		 */
		level_formula: (current_ruleset, current_session, character) => {

		},
	/**
	 * @param {Ruleset} current_ruleset
	 * @param {Session} current_session
	 * @param {Character} character
	 */
		max_hit_points_formula: (current_ruleset, current_session, character) => {

		},
	/**
	 * @param {Ruleset} current_ruleset
	 * @param {Session} current_session
	 * @param {Character} character
	 * @return {{ width:int, height:int, color:string }[]}
	 */
		inventory_size_formula:	(current_ruleset, current_session, character) => {
			if (current_session.EncumbranceOption === 0)
				return character.Attributes['Str'] * 15;
			else if (current_session.EncumbranceOption === 1) {
				const size = character.Attributes['Str'] * 5;
				return [{ width: size, height: size, color: 'green' }, { width: size, height: size, color: 'orange' }, { width: size, height: size, color: 'red' }];
			}
		}
	});

	/**
	 * `level_formula`, `attribute_bonus_formula`, `skill_bonus_formula`, and `inventory_size_formula` receives the following parameters: current_ruleset:Ruleset, current_session:Session, character:Character.
	 * `level_formula` additionally receives an array of level sources: { source:string, level:int }
	 * `attribute_bonus_formula` receives the name of the attribute the value as two additional parameters.
	 * `skill_bonus_formula` receives the name of the skill the level as two additional parameters.
	 *
	 * `inventory_size_formula` must return { size:int, color:str }[]. `color` must be a valid CSS color value.
	 *
	 * `skill_level_labels` is an array of labels used in place of numeric skill levels. For example: [ 'No proficiency', 'Proficient', '2x proficiency' ]
	 * Skill levels are provided to skill_bonus_formula as numeric values regardless of this.
	 *
	 * `encumbrance_options` is an array of labels for encumbrance options. The dropdown is only displayed when the array contains more than one option.
	 * This choice is assigned to the `EncumbranceOption` field in the current session.
	 *
	 * @param {string} id
	 * @param {string} name
	 * @param {{
	 * [character_fields]:FieldGroup[],
	 * [attributes]:string[],
	 * [skills]:{name:string,
	 * [attribute]:string}[],
	 * [skill_level_labels]:string[],
	 * [encumbrance_options]:string[]
	 * [level_formula]:function,
	 * [attribute_bonus_formula]:function,
	 * [skill_bonus_formula]:function,
	 * [max_hit_points_formula]:function,
	 * [inventory_size_formula]:string,
	 * [default_pins]:{ name:string, fields:string[] }[],
	 * [actions]:{ label:string, [icon]:string, key:string, fields:{ label:string, [show_label]:boolean, items:string[] }[], action:function(character:Character, fields:object)}[],
	 * [dice_colors]:Object.<string, string>,
	 * }} [options]
	 * Omitted options are assigned null values.
	 * @constructor
	 */
	constructor(id, name, options = {}) {
		this.ID = id;
		this.Name = name;
		this.CharacterFields = options.character_fields ?? null;
		this.LevelFormula = options.level_formula ?? null;
		this.DefaultPins = options.default_pins ?? {};
		this.Actions = options.actions ?? [];
		this.DiceColors = options.dice_colors ?? {};
		this.MaxHitPointsFormula = options.max_hit_points_formula ?? null;
		this.InventorySizeFormula = options.inventory_size_formula ?? null;
		this.EncumbranceOptions = options.encumbrance_options ?? null;
	}

	/**
	 * @param {Ruleset} current_ruleset
	 * @param {Session} current_session
	 * @param {Character} character
	 */
	level_formula(current_ruleset, current_session, character) {}
	/**
	 * @param {Ruleset} current_ruleset
	 * @param {Session} current_session
	 * @param {Character} character
	 */
	attribute_bonus_formula(current_ruleset, current_session, character) {}
	/**
	 * @param {Ruleset} current_ruleset
	 * @param {Session} current_session
	 * @param {Character} character
	 * @param {string} skill
	 * @param {int} skill_level
	 */
	skill_bonus_formula(current_ruleset, current_session, character, skill, skill_level) {}
	/**
	 * @param {Ruleset} current_ruleset
	 * @param {Session} current_session
	 * @param {Character} character
	 */
	max_hit_points_formula(current_ruleset, current_session, character) {}
	/**
	 * @param {Ruleset} current_ruleset
	 * @param {Session} current_session
	 * @param {Character} character
	 * @return {{ width:int, height:int, color:string }[]}
	 */
	inventory_size_formula(current_ruleset, current_session, character) {}

	/**
	 * @param {Session} session
	 * @param {Character} character
	 * @returns {{width: int, height:int, color: string}[]}
	 */
	InventorySize(session, character) {
		return this.inventory_size_formula(this, session, character);
	}

	/**
	 * @returns {FieldGroup[]}
	 */
	GetFields() {
		let copies = [];
		this.CharacterFields.forEach((group) => {
			copies.push(group.Clone());
		})
		return copies;
	}

	/**
	 * Takes a color preset label and tries to find a matching value in the ruleset.
	 * @param {string} name
	 * @param {*} default_value
	 * @returns {string|*}
	 */
	GetDiceColorByName(name, default_value = "") {
		if (name === null || typeof this.DiceColors !== "object" || !this.DiceColors.hasOwnProperty(name))
			return default_value;
		return this.DiceColors[name];
	}

	/**
	 * @param {Character} character
	 */
	UpdateCharacter(character) {
		/**
		 * Takes input character and searches for group by label. Returns last matching group or null on failure.
		 * @param {Character} character
		 * @param {string} label
		 * @returns {FieldGroup|null}
		 */
		function match_group(character, label) {
			let value = null;
			character.FieldGroups.forEach((group) => {
				if (group.Label === label)
					value = group;
			})
			return value;
		}

		/**
		 * Takes input field and searches for sub-field by label. Returns last matching field or null on failure.
		 * @param {Field} field
		 * @param {string} label
		 * @return {Field|null}
		 */
		function match_sub_field(field, label) {
			let value = null;
			if (Array.isArray(field.SubFields)) {
				field.SubFields.forEach((sub_field) => {
					if (sub_field.Label === label)
						value = sub_field;
					let sub_value = match_sub_field(sub_field, label);
					if (sub_value !== null)
						value = sub_value;
				})
			}
			return value;
		}

		/**
		 * Takes input group and searches for field by label. Returns last matching field or null on failure.
		 * @param {FieldGroup} group
		 * @param {string} label
		 * @returns {Field|null}
		 */
		function match_field(group, label) {
			let value = null;
			group.Fields.forEach((field) => {
				if (field.Label === label) {
					value = field;
				}
			})
			return value;
		}

		/**
		 * @param {Field} source Grabs values from here
		 * @param {Field} target Puts values here
		 */
		function set_subfield_values(source, target) {
			if (target.SubFields === null)
				return;
			if (source.SubFields === null)
				return;
			target.SubFields.forEach((target_sub_field) => {
				let source_sub_field = match_sub_field(source, target_sub_field.Label);
				if (source_sub_field !== null)
					target_sub_field.Value = source_sub_field.Value;
			})
		}

		const group_collection = [];
		this.CharacterFields.forEach((group) => {
			const c_group = match_group(character, group.Label);
			// console.debug(group.Label, c_group);
			if (c_group !== null) {
				const new_group = new FieldGroup(c_group.Label);
				group_collection.push(new_group);
				group.Fields.forEach((field) => {
					const c_field = match_field(c_group, field.Label);
					// console.debug(field.Label, c_field);
					if (c_field !== null) {
						const cloned_field = field.Clone();
						cloned_field.Value = c_field.Value;
						cloned_field.UserFormula = c_field.UserFormula;
						set_subfield_values(c_field, cloned_field);
						new_group.Fields.push(cloned_field);
					} else {
						// console.info("Append missing field to character fields", field.Label);
						c_group.Fields.push(field);
					}
				})
			} else {
				// console.info("Append missing group to character fields", group.Label);
				group_collection.push(group);
			}
		})
		console.debug(group_collection);
		character.FieldGroups = group_collection;
	}
}