
class DiceResult {
	/** @var {number} */
	_Value
	get Value() {
		return this._Value;
	}
	set Value(v) {
		this.ReplacedValues.push(this._Value);
		this._Value = v;
	}
	/** @var {number|string} */
	Size
	/** @var {DiceResultDecorator[]} */
	Decorators
	/** @var {string|null} */
	Color
	/** @var {number} */
	ExplodeCount
	/** @var {number[]} */
	ReplacedValues = []

	/**
	 * @param {number} result
	 * @param {number|string} size
	 * @param {string|null} color
	 * @param {DiceResultDecorator[]} [decorators]
	 */
	constructor(result, size, color = null, decorators = []) {
		this.Value = result;
		this.Size = size;
		this.Decorators = decorators;
		this.Color = color;
		this.ExplodeCount = 0;
		this.ReplacedValues = [];
	}

	toString() {
		let decorators = [];
		this.Decorators.forEach((decorator) => {
			decorators.push(decorator.toString()[0].toLowerCase());
		})
		let prefix = "";
		let suffix = "";
		if (decorators.length > 0) {
			prefix = "(";
			suffix = ")";
		}
		return this.Value + prefix + decorators.join(",") + suffix;
	}

	ToSimpleHTML() {
		const element = document.createElement("span");
		element.classList.add("simple_result")
		this.Decorators.forEach((decorator) => {
			element.classList.add(decorator.class);
		})
		element.innerText = this.Value.toString();
		return element;
	}

	GetLastReplaced() {
		if (this.ReplacedValues.length === 0)
			return null;
		return this.ReplacedValues.toReversed()[0];
	}

	/**
	 * @param {DiceResultDecorator[]} filter Decorators in filter will cause Get to return 0.
	 * @returns {number}
	 */
	Get(filter = [ DiceResultDecorator.DROPPED ]) {
		let result = false;
		filter.forEach((decorator) => {
			if (!this.Decorators.includes(decorator))
				result = true;
		})
		if (!result)
			return 0;
		return this.Value;
	}

	CountSuccess() {
		if (this.Decorators.includes(DiceResultDecorator.SUCCESS))
			return 1;
		return 0;
	}

	CountFailure() {
		if (this.Decorators.includes(DiceResultDecorator.FAILURE))
			return 1;
		return 0;
	}

	/**
	 * @param {DiceResultDecorator} decorators
	 */
	AddDecorators(...decorators) {
		decorators.forEach((decorator) => {
			if (!this.Decorators.includes(decorator))
				this.Decorators.push(decorator);
		})
	}

	/**
	 * @param {DiceResultDecorator} decorator
	 * @returns {boolean}
	 */
	HasDecorator(...decorator) {
		for (let i = 0; i < decorator.length; i++) {
			const dec = decorator[i];
			if (this.Decorators.includes(dec))
				return true;
		}
		return false;
	}

	GetDecoratorNames(default_value = "") {
		const names = [];
		this.Decorators.forEach((decorator) => {
			if (decorator === DiceResultDecorator.EXPLODED && this.ExplodeCount > 0)
				names.push(decorator.name + " x" + this.ExplodeCount);
			else if (decorator === DiceResultDecorator.REROLLED)
				names.push(decorator.name + " [" + this.ReplacedValues.join(", ") + "]");
			else
				names.push(decorator.name);
		})
		let name = default_value;
		if (names.length > 0)
			name = names.join(", ");
		if (this.Size === "F")
			return name + " fudge";
		return name;
	}

	GetDecoratorClasses() {
		const classes = [];
		this.Decorators.forEach((decorator) => {
			classes.push(decorator.class);
		})
		return classes;
	}

	GetDieHTML() {
		const element = document.createElement("die");
		let color = active_ruleset.GetDiceColorByName(this.Color, null);
		let name = "";
		if (color === null) {
			element.style.backgroundColor = this.Color;
			if (this.Color !== null)
				element.style.color = returnHighestContrast(this.Color, "black", "white");
		} else {
			element.style.backgroundColor = color;
			element.style.color = returnHighestContrast(color, "black", "white");
			name = " " + this.Color;
		}
		const classes = this.GetDecoratorClasses();
		element.classList.add(...classes);
		if (this.Size === "F") {
			if (this.Value === 1)
				element.classList.add("max");
			else if (this.Value === -1)
				element.classList.add("min");
		} else {
			if (this.Value === this.Size)
				element.classList.add("max");
			else if (this.Value === 1)
				element.classList.add("min");
		}
		let extra_tags = [];
		if (this.Decorators.includes(DiceResultDecorator.REROLLED))
			extra_tags.push("<rerolled></rerolled>");
		if (this.Decorators.includes(DiceResultDecorator.EXPLODED))
			extra_tags.push("<exploded></exploded>");

		element.title = this.GetDecoratorNames("Normal") + name;
		element.innerHTML = extra_tags.join("") + "<result>" + this.Value + "</result><size>d" + this.Size + "</size>";
		return element.outerHTML;
	}
}