
class Ruleset {
	/** @var {string} */
	ID
	/** @var {string} */
	Name
	/** @var {FieldGroup[]} */
	CharacterFields
	/** @var {{ name:string, fields:string[] }[]} */
	DefaultPins
	/** @var {{ label:string, icon:string, key:string, fields:string[], action:function(character:Character, fields:object) }[]} */
	Actions
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
				new FieldNumber("Strength", 			{ label_short: "Str", key: "str", size: 2, sub_fields: [ new FieldNumber("Strength Check", 			{key: "c", size: 2, }), new FieldNumber("Strength Save",				{key: "s", size: 2}) ]}),
				new FieldNumber("Dexterity", 			{ label_short: "Dex", key: "dex", size: 2, sub_fields: [ new FieldNumber("Dexterity Check",			{key: "c", size: 2, }), new FieldNumber("Dexterity Save", 			{key: "s", size: 2}) ]}),
				new FieldNumber("Constitution", 	{ label_short: "Con", key: "con", size: 2, sub_fields: [ new FieldNumber("Constitution Check", 	{key: "c", size: 2, }), new FieldNumber("Constitution Save",		{key: "s", size: 2}) ]}),
				new FieldNumber("Intelligence", 	{ label_short: "Int", key: "int", size: 2, sub_fields: [ new FieldNumber("Intelligence Check", 	{key: "c", size: 2, }), new FieldNumber("Intelligence Save",		{key: "s", size: 2}) ]}),
				new FieldNumber("Wisdom", 				{ label_short: "Wis", key: "wis", size: 2, sub_fields: [ new FieldNumber("Wisdom Check", 				{key: "c", size: 2, }), new FieldNumber("Wisdom Save",					{key: "s", size: 2}) ]}),
				new FieldNumber("Charisma", 			{ label_short: "Cha", key: "cha", size: 2, sub_fields: [ new FieldNumber("Charisma Check", 			{key: "c", size: 2, }), new FieldNumber("Charisma Save",				{key: "s", size: 2}) ]}),
			),
			new FieldGroup("Skills",
				new FieldNumber("Acrobatics", 			{key: "acrobatics", 				rollable: "d20 + {f}", formula: "{acrobatics.p}*{prof}+{dex}", size: 4, sub_fields: [ new FieldNumber("Acrobatics Proficiency", {key: "p", min: 0, max: 2, size: 3}) ]}),
				new FieldNumber("Animal Handling", 	{key: "animal_handling", 	rollable: "d20 + {f}", formula: "{animal_handling.p}*{prof}+{wis}", size: 4, sub_fields: [ new FieldNumber("Animal Handling Proficiency", {key: "p", min: 0, max: 2, size: 3}) ]}),
				new FieldNumber("Arcana", 					{key: "arcana", 						rollable: "d20 + {f}", formula: "{arcana.p}*{prof}+{int}", size: 4, sub_fields: [ new FieldNumber("Arcana Proficiency", {key: "p", min: 0, max: 2, size: 3}) ]}),
				new FieldNumber("Athletics", 				{key: "athletics", 				rollable: "d20 + {f}", formula: "{athletics.p}*{prof}+{str}", size: 4, sub_fields: [ new FieldNumber("Athletics Proficiency", {key: "p", min: 0, max: 2, size: 3}) ]}),
				new FieldNumber("Deception", 				{key: "deception", 				rollable: "d20 + {f}", formula: "{deception.p}*{prof}+{cha}", size: 4, sub_fields: [ new FieldNumber("Deception Proficiency", {key: "p", min: 0, max: 2, size: 3}) ]}),
				new FieldNumber("History", 					{key: "history", 					rollable: "d20 + {f}", formula: "{history.p}*{prof}+{int}", size: 4, sub_fields: [ new FieldNumber("History Proficiency", {key: "p", min: 0, max: 2, size: 3}) ]}),
				new FieldNumber("Insight", 					{key: "insight", 					rollable: "d20 + {f}", formula: "{insight.p}*{prof}+{wis}", size: 4, sub_fields: [ new FieldNumber("Insight Proficiency", {key: "p", min: 0, max: 2, size: 3}) ]}),
				new FieldNumber("Intimidation", 		{key: "intimidation", 			rollable: "d20 + {f}", formula: "{intimidation.p}*{prof}+{cha}", size: 4, sub_fields: [ new FieldNumber("Intimidation Proficiency", {key: "p", min: 0, max: 2, size: 3}) ]}),
				new FieldNumber("Investigation", 		{key: "investigation", 		rollable: "d20 + {f}", formula: "{investigation.p}*{prof}+{int}", size: 4, sub_fields: [ new FieldNumber("Investigation Proficiency", {key: "p", min: 0, max: 2, size: 3}) ]}),
				new FieldNumber("Medicine", 				{key: "medicine", 					rollable: "d20 + {f}", formula: "{medicine.p}*{prof}+{wis}", size: 4, sub_fields: [ new FieldNumber("Medicine Proficiency", {key: "p", min: 0, max: 2, size: 3}) ]}),
				new FieldNumber("Nature", 					{key: "nature", 						rollable: "d20 + {f}", formula: "{nature.p}*{prof}+{int}", size: 4, sub_fields: [ new FieldNumber("Nature Proficiency", {key: "p", min: 0, max: 2, size: 3}) ]}),
				new FieldNumber("Perception", 			{key: "perception", 				rollable: "d20 + {f}", formula: "{perception.p}*{prof}+{wis}", size: 4, sub_fields: [ new FieldNumber("Perception Proficiency", {key: "p", min: 0, max: 2, size: 3}) ]}),
				new FieldNumber("Performance", 			{key: "performance", 			rollable: "d20 + {f}", formula: "{performance.p}*{prof}+{cha}", size: 4, sub_fields: [ new FieldNumber("Performance Proficiency", {key: "p", min: 0, max: 2, size: 3}) ]}),
				new FieldNumber("Persuasion", 			{key: "persuasion", 				rollable: "d20 + {f}", formula: "{persuasion.p}*{prof}+{cha}", size: 4, sub_fields: [ new FieldNumber("Persuasion Proficiency", {key: "p", min: 0, max: 2, size: 3}) ]}),
				new FieldNumber("Religion", 				{key: "religion", 					rollable: "d20 + {f}", formula: "{religion.p}*{prof}+{int}", size: 4, sub_fields: [ new FieldNumber("Religion Proficiency", {key: "p", min: 0, max: 2, size: 3}) ]}),
				new FieldNumber("Sleight of Hand", 	{key: "sleight_of_hand", 	rollable: "d20 + {f}", formula: "{sleight_of_hand.p}*{prof}+{dex}", size: 4, sub_fields: [ new FieldNumber("Sleight of Hand Proficiency", {key: "p", min: 0, max: 2, size: 3}) ]}),
				new FieldNumber("Stealth", 					{key: "stealth", 					rollable: "d20 + {f}", formula: "{stealth.p}*{prof}+{dex}", size: 4, sub_fields: [ new FieldNumber("Stealth Proficiency", {key: "p", min: 0, max: 2, size: 3}) ]}),
				new FieldNumber("Survival", 				{key: "survival", 					rollable: "d20 + {f}", formula: "{survival.p}*{prof}+{wis}", size: 4, sub_fields: [ new FieldNumber("Survival Proficiency", {key: "p", min: 0, max: 2, size: 3}) ]}),
				new FieldNumber("Thieves' Tools", 	{key: "thieves_tools", 		rollable: "d20 + {f}", formula: "{thieves_tools.p}*{prof}+{dex}", size: 4, sub_fields: [ new FieldNumber("Thieves' Tools Proficiency", {key: "p", min: 0, max: 2, size: 3}) ]})
			),
			new FieldGroup("Misc",
				new FieldText("Race"),
				new FieldText("Class"),
				new FieldText("Alignment"),
				new FieldText("Background"),
				new FieldText("Proficiency Bonus", { key: "prof", size: 2 }),
				new FieldText("Walk speed"),
				new FieldText("Swim speed"),
				new FieldText("Fly speed"),
				new FieldText("Resistances"),
				new FieldText("Immunities"),
				new FieldNumber("Armor class", { label_short: "AC", key: "ac", size: 3 }),
				new FieldText("Hit dice", { key: "hd", size: 2 }),
				new FieldNumber("Wounds", { label_short: "W", key: "wounds", size: 3, sub_fields: [ new FieldNumber("Hit points", { label_short: "Max", key: "hpmax", size: 3, formula: "" }) ], sub_field_divider: "/" }),
				new FieldNumber("Temporary Hit points", { label_short: "Temp. HP", key: "thp", size: 3 })
			)
		],
		default_pins: [
			{name: "info", fields: ["Race", "Class", "Background", "Proficiency Bonus"]},
			{name: "status", fields: ["Armor Class", "Wounds", "Temporary Hit points"]}
		],
		actions: [
			{ label: "Take damage", icon: "game-icons/carl-olsen/crossbow.png", key: "damage",
				fields: [
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
				], action: (character, fields) => {
					const msg_duration = 30;
					const resistant = character.GetField("Resistances", "");
					const immune = character.GetField("Immunities", "");
					let total_damage = 0;
					for (let field in fields) {
						let starting_damage = parseFloat(fields[field]);
						let val = parseFloat(fields[field]);
						if (isNaN(val))
							val = 0;
						if (resistant.toLowerCase().indexOf(field.toLowerCase()) !== -1) {
							val = Math.floor(val * .5);
							notifications.Success(`Resisted ${val} ${field} damage!`, { duration: msg_duration });
						}
						if (immune.toLowerCase().indexOf(field.toLowerCase()) !== -1) {
							val = 0;
							notifications.Success(`Completely resisted ${starting_damage} ${field} damage!`, { duration: msg_duration });
						}
						total_damage += val;
					}
					console.debug(character);
					console.debug(fields, total_damage);
					let temp_hp = character.GetField("Temporary Hit points", 0);
					console.debug("temp", temp_hp);
					let diff = temp_hp - total_damage;
					console.debug("diff", diff);
					if (diff >= 0) {
						character.SetField("Temporary Hit points", diff);
						notifications.Warning(`Took ${total_damage} damage. All to temp. hit points.`, { duration: msg_duration });
					} else {
						character.SetField("Temporary Hit points", 0);
						diff *= -1;
						character.SetField("Wounds", character.GetField("Wounds", 0) + diff);
						notifications.Error(`Took ${total_damage} damage! ${total_damage - diff} absorbed by temp. hit points.`, { duration: msg_duration });
					}
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
	 * [actions]:{ label:string, [icon]:string, key:string, fields:string[], action:function(character:Character, fields:object)}[],
	 * }} [options]
	 * Omitted options are assigned null values.
	 * @constructor
	 */
	constructor(id, name, options = {}) {
		this.ID = id;
		this.Name = name;
		this.CharacterFields = options.character_fields ?? null;
		this.LevelFormula = options.level_formula ?? null;
		this.MaxHitPointsFormula = options.max_hit_points_formula ?? null;
		this.InventorySizeFormula = options.inventory_size_formula ?? null;
		this.EncumbranceOptions = options.encumbrance_options ?? null;
		this.DefaultPins = options.default_pins ?? {};
		this.Actions = options.actions ?? []
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
						cloned_field.CustomFormula = c_field.CustomFormula;
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