
class Ruleset {
	/** @var {string} */
	ID
	/** @var {string} */
	Name
	/** @var {FieldGroup[]} */
	CharacterFields
	/** @var {{ name:string, fields:string[] }[]} */
	DefaultPins
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
				new FieldNumber("Strength", 			{ label_short: "Str", key: "str", size: 2, sub_field: new FieldNumber("Strength Check", 			{key: "str.c", size: 2, sub_field: new FieldNumber("Strength Save", 			{key: "str.s", size: 2})})}),
				new FieldNumber("Dexterity", 			{ label_short: "Dex", key: "dex", size: 2, sub_field: new FieldNumber("Dexterity Check", 		{key: "dex.c", size: 2, sub_field: new FieldNumber("Dexterity Save", 		{key: "dex.s", size: 2})})}),
				new FieldNumber("Constitution", 	{ label_short: "Con", key: "con", size: 2, sub_field: new FieldNumber("Constitution Check", 	{key: "con.c", size: 2, sub_field: new FieldNumber("Constitution Save", 	{key: "con.s", size: 2})})}),
				new FieldNumber("Intelligence", 	{ label_short: "Int", key: "int", size: 2, sub_field: new FieldNumber("Intelligence Check", 	{key: "int.c", size: 2, sub_field: new FieldNumber("Intelligence Save", 	{key: "int.s", size: 2})})}),
				new FieldNumber("Wisdom", 				{ label_short: "Wis", key: "wis", size: 2, sub_field: new FieldNumber("Wisdom Check", 				{key: "wis.c", size: 2, sub_field: new FieldNumber("Wisdom Save", 				{key: "wis.s", size: 2})})}),
				new FieldNumber("Charisma", 			{ label_short: "Cha", key: "cha", size: 2, sub_field: new FieldNumber("Charisma Check", 			{key: "cha.c", size: 2, sub_field: new FieldNumber("Charisma Save", 			{key: "cha.s", size: 2})})}),
			),
			new FieldGroup("Skills",
				new FieldNumber("Acrobatics", 			{key: "acrobatics", 				rollable: true, size: 4, sub_field: new FieldNumber("Acrobatics Proficiency", {key: "acrobatics.p", min: 0, max: 2, size: 3})}),
				new FieldNumber("Animal Handling", 	{key: "animal_handling", 	rollable: true, size: 4, sub_field: new FieldNumber("Animal Handling Proficiency", {key: "animal_handling.p", min: 0, max: 2, size: 3})}),
				new FieldNumber("Arcana", 					{key: "arcana", 						rollable: true, size: 4, sub_field: new FieldNumber("Arcana Proficiency", {key: "arcana.p", min: 0, max: 2, size: 3})}),
				new FieldNumber("Athletics", 				{key: "athletics", 				rollable: true, size: 4, sub_field: new FieldNumber("Athletics Proficiency", {key: "athletics.p", min: 0, max: 2, size: 3})}),
				new FieldNumber("Deception", 				{key: "deception", 				rollable: true, size: 4, sub_field: new FieldNumber("Deception Proficiency", {key: "deception.p", min: 0, max: 2, size: 3})}),
				new FieldNumber("History", 					{key: "history", 					rollable: true, size: 4, sub_field: new FieldNumber("History Proficiency", {key: "history.p", min: 0, max: 2, size: 3})}),
				new FieldNumber("Insight", 					{key: "insight", 					rollable: true, size: 4, sub_field: new FieldNumber("Insight Proficiency", {key: "insight.p", min: 0, max: 2, size: 3})}),
				new FieldNumber("Intimidation", 		{key: "intimidation", 			rollable: true, size: 4, sub_field: new FieldNumber("Intimidation Proficiency", {key: "intimidation.p", min: 0, max: 2, size: 3})}),
				new FieldNumber("Investigation", 		{key: "investigation", 		rollable: true, size: 4, sub_field: new FieldNumber("Investigation Proficiency", {key: "investigation.p", min: 0, max: 2, size: 3})}),
				new FieldNumber("Medicine", 				{key: "medicine", 					rollable: true, size: 4, sub_field: new FieldNumber("Medicine Proficiency", {key: "medicine.p", min: 0, max: 2, size: 3})}),
				new FieldNumber("Nature", 					{key: "nature", 						rollable: true, size: 4, sub_field: new FieldNumber("Nature Proficiency", {key: "nature.p", min: 0, max: 2, size: 3})}),
				new FieldNumber("Perception", 			{key: "perception", 				rollable: true, size: 4, sub_field: new FieldNumber("Perception Proficiency", {key: "perception.p", min: 0, max: 2, size: 3})}),
				new FieldNumber("Performance", 			{key: "performance", 			rollable: true, size: 4, sub_field: new FieldNumber("Performance Proficiency", {key: "performance.p", min: 0, max: 2, size: 3})}),
				new FieldNumber("Persuasion", 			{key: "persuasion", 				rollable: true, size: 4, sub_field: new FieldNumber("Persuasion Proficiency", {key: "persuasion.p", min: 0, max: 2, size: 3})}),
				new FieldNumber("Religion", 				{key: "religion", 					rollable: true, size: 4, sub_field: new FieldNumber("Religion Proficiency", {key: "religion.p", min: 0, max: 2, size: 3})}),
				new FieldNumber("Sleight of Hand", 	{key: "sleight_of_hand", 	rollable: true, size: 4, sub_field: new FieldNumber("Sleight of Hand Proficiency", {key: "sleight_of_hand.p", min: 0, max: 2, size: 3})}),
				new FieldNumber("Stealth", 					{key: "stealth", 					rollable: true, size: 4, sub_field: new FieldNumber("Stealth Proficiency", {key: "stealth.p", min: 0, max: 2, size: 3})}),
				new FieldNumber("Survival", 				{key: "survival", 					rollable: true, size: 4, sub_field: new FieldNumber("Survival Proficiency", {key: "survival.p", min: 0, max: 2, size: 3})}),
				new FieldNumber("Thieves' Tools", 	{key: "thieves_tools", 		rollable: true, size: 4, sub_field: new FieldNumber("Thieves' Tools Proficiency", {key: "thieves_tools.p", min: 0, max: 2, size: 3})})
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
				new FieldNumber("Armor class", { label_short: "AC", key: "ac", size: 3 }),
				new FieldText("Hit dice", { key: "hd", size: 2 }),
				new FieldNumber("Wounds", { label_short: "W", key: "wounds", size: 3, sub_field: new FieldNumber("Hit points", { label_short: "Max", key: "hpmax", size: 3 }), sub_field_divider: "/" }),
				new FieldNumber("Temporary Hit points", { label_short: "Temp. HP", key: "thp", size: 3 })
			)
		],
		default_pins: [
			{name: "info", fields: ["Race", "Class", "Background", "Proficiency Bonus"]},
			{name: "status", fields: ["Armor Class", "Wounds", "Temporary Hit points"]}
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
	 * character_fields:string[],
	 * attributes:string[],
	 * skills:{name:string,
	 * attribute:string}[],
	 * skill_level_labels:string[],
	 * encumbrance_options:string[]
	 * level_formula:function,
	 * attribute_bonus_formula:function,
	 * skill_bonus_formula:function,
	 * max_hit_points_formula:function,
	 * inventory_size_formula:string,
	 * default_pins:{ name:string, fields:string[] }[]
	 * }} options
	 * Omitted options are assigned null values.
	 * @constructor
	 */
	constructor(id, name, options = {}) {
		this.ID = id;
		this.Name = name;
		this.CharacterFields = options.character_fields || null;
		this.LevelFormula = options.level_formula || null;
		this.MaxHitPointsFormula = options.max_hit_points_formula || null;
		this.InventorySizeFormula = options.inventory_size_formula || null;
		this.EncumbranceOptions = options.encumbrance_options || null;
		this.DefaultPins = options.default_pins || {};
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
}