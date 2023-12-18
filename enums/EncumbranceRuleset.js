
class EncumbranceRuleset {
	Name

	static Standard = new EncumbranceRuleset("Standard");
	static Variant = new EncumbranceRuleset("Variant");
	static Custom = new EncumbranceRuleset("Custom");

	constructor(name) {
		this.Name = name;
	}

	/**
	 * @param {int} strength
	 * @param {CharacterSize} size
	 * @returns {int}
	 */
	static GetCarryingCapacity(strength, size) {
		if (size === CharacterSize.Tiny)
			return Math.floor(strength / 2);
		if (size === CharacterSize.Large)
			return Math.floor(strength * 2);
		if (size === CharacterSize.Huge)
			return Math.floor(strength * 4);
		return strength;
	}

	/**
	 * @param {EncumbranceRuleset} ruleset
	 * @param {int} strength
	 * @param {CharacterSize} size
	 * @returns {{level1: number, level3: number, level2: number}|{level1: number, level3: null, level2: null}|null}
	 * @constructor
	 */
	static CalculateLevels(ruleset, strength, size) {
		if (ruleset === EncumbranceRuleset.Standard) {
			return { level1: this.GetCarryingCapacity(strength, size) * 15, level2: null, level3: null };
		} else if (ruleset === EncumbranceRuleset.Variant) {
			return { level1: 0, level2: 0, level3: 0 };
		}
		return null;
	}
}

class EncumbranceStandard extends EncumbranceRuleset {
	static GetLevelsForStrength(strength, size) {
		return { level1: this.GetCarryingCapacity(strength, size) * 15, level2: null, level3: null };
	}
}
class EncumbranceVariant extends EncumbranceRuleset {
	static GetLevelsForStrength(strength) {
		return { level1: 0, level2: 0, level3: 0 };
	}
}
class EncumbranceCustom extends EncumbranceRuleset {
	static GetLevelsForStrength(strength) {

	}
}