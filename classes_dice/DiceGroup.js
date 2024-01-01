
class DiceGroup {
	/** @var {number} */
	DiceIndex
	/** @var {number} */
	Amount
	/** @var {number|"F"} */
	Size
	/** @var {DiceMod[]} */
	Modifiers
	/** @var {string|null} */
	Color
	/** @var {DiceResultCollection} */
	Results

	/**
	 * @param {{ [index]:number, [amount]:int, [size]:number|"F", [modifiers]:DiceMod[], [color]:string }} options
	 */
	constructor(options = {}) {
		this.DiceIndex = options.index ?? 0;
		this.Amount = options.amount ?? 1;
		if (options.size === "F")
			this.Size = "F";
		else
			this.Size = Math.max(2, options.size ?? 20);
		this.Modifiers = options.modifiers ?? [];
		this.Color = options.color ?? null;
		this.Results = new DiceResultCollection();
	}

	static ProcessDiceModifiers(dice) {
		dice.Modifiers.forEach((mod) => {
			mod.Parse(dice);
		})
		return dice;
	}

	ProcessModifiers() {
		DiceGroup.ProcessDiceModifiers(this);
	}

	RollAll() {
		this.Results.Clear();
		for (let i = 0; i < this.Amount; i++) {
			if (this.Size === "F")
				this.Results.AddResults(new DiceResult(getRandomInt(-1, 1), this.Size, this.Color));
			else
				this.Results.AddResults(new DiceResult(getRandomInt(1, this.Size), this.Size, this.Color));
		}
		this.ProcessModifiers();
		return this.Results;
	}

	/**
	 * @returns {number}
	 */
	RollSingleUnmodified() {
		if (this.Size === "F")
			return getRandomInt(-1, 1);
		return getRandomInt(1, this.Size);
	}

	/**
	 * @param {DiceMod[]|null} override_modifiers
	 * @returns {DiceResultCollection}
	 */
	RollSingle(override_modifiers = null) {
		// console.debug("Roll single", override_modifiers);
		const modifiers = override_modifiers ?? this.Modifiers;
		const d = new DiceGroup({ size: this.Size, modifiers: modifiers, color: this.Color });
		d.RollAll();
		return d.Results;
	}

	Sum() {
		return this.Results.Sum();
	}

	Successes() {
		return this.Results.Count();
	}

	/**
	 * Takes a die size and reduces it by one size according to the physical die sizes. Irregular values passed to this
	 * function will return in null being returned, unless `prevent_irregular` is set to false, in which case irregular
	 * values will be reduced by 2 and returned.
	 * @param {number} input_size
	 * @param {boolean } [prevent_irregular]
	 * @returns {number|null}
	 */
	static ReduceDieSize(input_size, prevent_irregular = true) {
		switch (input_size) {
			case 100:
				return 20;
			case 20:
				return 12;
			case 12:
				return 10;
			case 10:
				return 8;
			case 8:
				return 6;
			case 6:
				return 4;
		}
		if (prevent_irregular)
			return null;
		return input_size - 2;
	}
}