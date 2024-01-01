
class DiceStringParser {
	/** @var {string} */
	DiceString
	/** @var {DiceGroup[]} */
	DiceCollection

	constructor(dice_string, dice) {
		this.DiceString = dice_string;
		this.DiceCollection = dice;
	}

	static ParseDiceString(str) {
		str = KeyStore.ParseFormulaKeys(str); // TODO Enable displaying the source of the value when rendering as html
		const pattern = /(?<amount>\d*)d(?<size>\d+|F)(?<modifiers>[!a-z<>=\d]*)(?:\[(?<color>(.*?))])?/;
		let match = true;
		let match_index = 0;
		const dice = [];
		while (match) {
			match = str.match(pattern);
			if (match !== null) {
				str = str.substring(0, match.index) + "[dice_" + match_index + "]" + str.substring(match.index + match[0].length);
				let amount = 1;
				if (!isNaN(parseInt(match.groups.amount)))
					amount = parseInt(match.groups.amount);
				const size = match.groups.size;
				const modifiers = match.groups.modifiers ?? null;
				const mods = DiceMod.ParseModifiers(modifiers);
				const color = match.groups.color ?? null;
				dice.push(new DiceGroup({ index: match_index, amount: amount, size: size, modifiers: mods, color: color }));
				match_index++;
			}
		}
		return new this(str, dice);
	}

	HasDecorator(...decorator) {
		for (let i = 0; i < this.DiceCollection.length; i++) {
			const dice_group = this.DiceCollection[i];
			for (let o = 0; o < dice_group.Results.Results.length; o++) {
				const result = dice_group.Results.Results[o];
				if (result.HasDecorator(...decorator))
					return true;
			}
		}
		return false;
	}

	Roll() {
		this.DiceCollection.forEach((dice) => {
			dice.RollAll();
		})
		return this;
	}

	Sum() {
		let sum = 0;
		this.DiceCollection.forEach((dice) => {
			sum += dice.Sum();
		})
		return sum;
	}

	Successes() {
		let successes = 0;
		this.DiceCollection.forEach((dice) => {
			successes += dice.Successes();
		})
		return successes;
	}

	/**
	 * @param {{ [full_html_format]:boolean, [append_sum]:boolean, [simple_html_format]:boolean }} options
	 * @returns {string}
	 * @constructor
	 */
	GetFormattedString(options = {}) {
		const full_html_format = options.full_html_format ?? false;
		const append_sum = options.append_sum ?? false;
		const simple_html_format = options.simple_html_format ?? false;
		let str = this.DiceString;
		str = str.replaceAll(/([+*/-])/g, "<symbol>$1</symbol>");
		str = str.replaceAll(/(?<!_)(\d+)/g, "<text>$1</text>");

		this.DiceCollection.forEach((dice_group) => {
			if (full_html_format) {
				if (dice_group.Results.Results.length === 1) {
					const result = dice_group.Results.Results[0];
					str = str.replace("[dice_" + dice_group.DiceIndex + "]", result.GetDieHTML());
				} else {
					let html = "<dice_group>";
					html += "<dice_group_bracket_part style='top: 0; left: 0;'></dice_group_bracket_part>";
					html += "<dice_group_bracket_part style='bottom: 0; left: 0;'></dice_group_bracket_part>";
					html += "<dice_group_bracket_part style='top: 0; right: 0;'></dice_group_bracket_part>";
					html += "<dice_group_bracket_part style='bottom: 0; right: 0;'></dice_group_bracket_part>";
					let counter = 1;
					html += "<dice>";
					dice_group.Results.Results.forEach((r) => {
						if (counter === 1)
							html += "<dice_row>";
						html += r.GetDieHTML();
						if (counter !== 1 && counter % 5 === 0)
							html += "</dice_row>";
						if (counter % 5 === 0 && counter !== dice_group.Results.Results.length)
							html += "<dice_row>";
						counter++;
					})
					html += "</dice>";
					html += "<group_result>" + dice_group.Sum() + "</group_result>";
					html += "</dice_group>";
					str = str.replace("[dice_" + dice_group.DiceIndex + "]", html);
				}
			} else if (simple_html_format) {
				const element = dice_group.Results.ToSimpleHTML();
				str = str.replace("[dice_" + dice_group.DiceIndex + "]", "[ " + element.outerHTML + " -> " + dice_group.Sum().toString() + " ]")
			} else {
				str = str.replace("[dice_" + dice_group.DiceIndex + "]", dice_group.Sum().toString());
			}
		})
		if (full_html_format && append_sum) {
			const parsed = parse_html_dice_string(str);
			let calc = parse_math_expression(parsed);
			str += "<symbol>=</symbol><text>" + calc + "</text>";
		}
		return str;
	}

	// <editor-fold desc="Testing methods">
	static DiceRollDistributionTest(dice_string, iterations = 100000) {
		const results = [];
		const totals = [];
		const d = DiceStringParser.ParseDiceString(dice_string);
		let total = 0;
		let max_die_size = 0;
		let smallest_result = 9999999;
		for (let i = 0; i < iterations; i++) {
			d.Roll();
			d.DiceCollection.forEach((dice_group) => {
				max_die_size = Math.max(max_die_size, dice_group.Size);
				smallest_result = Math.min(smallest_result, dice_group.Amount);
				dice_group.Results.Results.forEach((result) => {
					if (!result.HasDecorator(DiceResultDecorator.DROPPED)) {
						const result_value = result.Value;
						if (typeof results[result_value] === "undefined")
							results[result_value] = 1;
						else
							results[result_value] += 1;
						total += 1;
					}
				})
				const sum = dice_group.Sum();
				if (typeof totals[sum] === "undefined")
					totals[sum] = 1;
				else
					totals[sum] += 1;
			})
		}
		let min = null;
		let min_i = null;
		let max = null;
		let max_i = null;
		for (let i = 1; i < results.length; i++) {
			const res = results[i];
			if (min === null) {
				min = res;
				min_i = i;
			} else if (res < min) {
				min = res;
				min_i = i;
			}
			if (max === null) {
				max = res;
				max_i = i;
			} else if (res > max) {
				max = res;
				max_i = i;
			}
		}
		console.debug("min", min, "max", max);
		let diff = Math.abs(max - min);
		return { results: results, totals: totals, rolls: iterations, dice_rolled: total, mean: total / max_die_size, min: min_i, max: max_i, min_value: min, max_value: max, diff: diff, smallest_result: smallest_result };
	}

	/**
	 * @param {{ results:int[], totals:int[], total:int, mean:float, min:int, max:int, min_value:int, max_value:int, diff:int, smallest_result:int }} data
	 */
	static GetRollDistributionGraph(data) {
		console.debug(data);
		const results = data.results;
		const max = data.max_value;

		let container = document.createElement("div");
		container.style.height = "500px";
		container.style.margin = "50px";
		container.style.marginLeft = "200px";

		for (let i = data.smallest_result; i < results.length; i++) {
			const val = results[i];
			const bar = document.createElement("div");
			bar.style.width = "30px";
			const perc = ((val / max) * 100);
			console.debug("perc", perc);
			bar.style.height = perc.toString() + "%";
			bar.style.marginRight = "10px";
			bar.style.position = "relative";
			bar.style.display = "inline-block";
			if (i === data.min)
				bar.style.backgroundColor = "green";
			else if (i === data.max)
				bar.style.backgroundColor = "blue";
			else
				bar.style.backgroundColor = "red";
			container.appendChild(bar);

			const label = document.createElement("div");
			label.innerText = i.toString();
			label.style.position = "absolute";
			label.style.bottom = "-20px";
			label.style.left = "50%";
			label.style.translate = "-50%";
			bar.appendChild(label);

			const value =  document.createElement("div");
			value.innerText = val.toString();
			value.style.position = "absolute";
			value.style.rotate = "90deg";
			value.style.bottom = "50px";
			value.style.left = "-18px";
			value.style.fontSize = "24pt";
			bar.appendChild(value);
		}
		return container;
	}

	/**
	 * @param {{ results:int[], totals:int[], total:int, mean:float, min:int, max:int, min_value:int, max_value:int, diff:int, smallest_result:int }} data
	 */
	static GetResultDistributionGraph(data) {
		console.debug(data);
		const results = data.totals;
		const max = data.max_value;

		let container = document.createElement("div");
		container.style.height = "500px";
		container.style.margin = "50px";
		container.style.marginLeft = "200px";

		for (let i = data.smallest_result; i < results.length; i++) {
			const val = results[i];
			const bar = document.createElement("div");
			bar.style.width = "30px";
			const perc = ((val / max) * 100);
			console.debug("perc", perc);
			bar.style.height = perc.toString() + "%";
			bar.style.marginRight = "10px";
			bar.style.position = "relative";
			bar.style.display = "inline-block";
			if (i === data.min)
				bar.style.backgroundColor = "green";
			else if (i === data.max)
				bar.style.backgroundColor = "blue";
			else
				bar.style.backgroundColor = "red";
			container.appendChild(bar);

			const label = document.createElement("div");
			label.innerText = i.toString();
			label.style.position = "absolute";
			label.style.bottom = "-20px";
			label.style.left = "50%";
			label.style.translate = "-50%";
			bar.appendChild(label);

			const value =  document.createElement("div");
			value.innerText = val.toString();
			value.style.position = "absolute";
			value.style.rotate = "90deg";
			value.style.bottom = "50px";
			value.style.left = "-18px";
			value.style.fontSize = "24pt";
			bar.appendChild(value);
		}
		return container;
	}

	/**
	 * @param {string} dice_string
	 * @param {{ [decorators]:DiceResultDecorator[], [max_iterations]:int, [desired_hits]:int }} options
	 */
	static DiceRollTest(dice_string, options = {}) {
		notifications.Clear()
		const desired_decorators = options.decorators ?? [];
		const max_iterations = options.max_iterations ?? 100;
		const desired_hits = options.desired_hits ?? 1;
		const d = DiceStringParser.ParseDiceString(dice_string);

		let current_iteration = 0;
		let hits = 0;
		while (current_iteration < max_iterations) {
			current_iteration++;
			d.Roll();

			if (desired_decorators.length > 0) {
				for (let i = 0; i < desired_decorators.length; i++) {
					if (d.HasDecorator(desired_decorators[i])) {
						hits++;
						console.debug(d);
						notifications.Dice(d.GetFormattedString({ full_html_format: true, append_sum: true }), { duration: 0, sender: "DiceRollTest" });
						if (hits === desired_hits) {
							console.debug(`Rolled ${current_iteration} times`);
							return;
						}
					}
				}
			} else {
				console.debug(d);
				notifications.Dice(d.GetFormattedString({ full_html_format: true, append_sum: true }), { duration: 0, sender: "DiceRollTest" });
			}
		}
		if (desired_decorators.length > 0)
			console.warn(`Insufficient hits in ${max_iterations} iterations.`);
	}
	// </editor-fold>
}