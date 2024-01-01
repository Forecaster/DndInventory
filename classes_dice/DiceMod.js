
class DiceMod {
	/** @var {DiceModType} */
	Type
	/** @var {number} */
	Target
	/** @var {DiceModMode} */
	Mode

	/**
	 * @param {DiceModType} type
	 * @param {number} target
	 * @param {DiceModMode} [mode]
	 */
	constructor(type, target, mode = null) {
		if (typeof type === "undefined") {
			console.error("Invalid type specified!");
			return;
		}
		if (typeof mode === "undefined") {
			console.error("Invalid mode specified!");
			return;
		}
		this.Type = type;
		this.Target = target;
		this.Mode = mode;
	}

	/**
	 * @param {DiceGroup} dice
	 */
	Parse(dice) {
		return this.Type.action(dice, this.Target, this.Mode)
	}

	/**
	 * @param {string} str
	 * @returns {DiceMod[]}
	 */
	static ParseModifiers(str) {
		const modifiers = [];
		if (typeof str === "undefined" || str === null || str === "")
			return [];
		for (let type in DiceModType) {
			const match = DiceModType[type].match(str);
			// console.debug(str, type, match);
			if (match !== null) {
				match.forEach((m) => {
					let mode = DiceModMode.get_by_mod(m.groups.symbol ?? "");
					modifiers.push(new this(DiceModType[type], (m.groups.target ? parseFloat(m.groups.target) : null), mode))
					str = str.substring(0, m.index) + "#".repeat(m[0].length) + str.substring(m.index + m[0].length);
				})
				str = str.replaceAll("#", "");
				if (str.length === 0)
					break;
			}
		}
		// console.debug(modifiers);
		return modifiers;
	}
}