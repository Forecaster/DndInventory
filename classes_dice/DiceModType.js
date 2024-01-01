
class DiceModType {
	static CRIT_SUCCESS = new this("Crit", /cs(?:(?<symbol>[<>=]+)(?<target>\d+))?/g, (dice, target, mode) => {
		if (mode === null)
			mode = DiceModMode.GREATER_OR_EQUAL;
		if (target === null)
			target = dice.Size;
		dice.Results.Results.forEach((dice_result) => {
			if (mode.compare(dice_result.Value, target))
				dice_result.AddDecorators(DiceResultDecorator.CRIT_SUCCESS);
		})
	});
	static CRIT_FAILURE = new this("Fail", /cf(?:(?<symbol>[<>=]+)(?<target>\d+))?/g, (dice, target, mode) => {
		if (mode === null)
			mode = DiceModMode.LESSER_OR_EQUAL;
		if (target === null)
			target = 1;
		dice.Results.Results.forEach((dice_result) => {
			console.debug(dice_result);
			if (mode.compare(dice_result.Value, target))
				dice_result.AddDecorators(DiceResultDecorator.CRIT_FAILURE);
		})
	});
	// Compounding exploding dice adds each additional result together as a single roll.
	static EXPLODING_COMPOUND = new this("Compounding exploding", /!!(?:(?<symbol>[<>=]+)(?<target>\d+))?/g, (dice, target, mode) => {
		// console.debug(dice);
		if (mode === null) {
			mode = DiceModMode.EQUAL;
			target = parseInt(dice.Size);
		}
		dice.Results.Results.forEach((dice_result) => {
			if (mode.compare(dice_result.Value, target)) {
				dice_result.ExplodeCount += 1;
				dice_result.AddDecorators(DiceResultDecorator.EXPLODED);
				// console.debug("Results before " + dice.Results.Results.toString());
				const roll = dice.RollSingle();
				const res = roll.Results[0];
				dice_result.ExplodeCount += res.ExplodeCount;
				// console.warn("Explosion!");
				dice_result.Value += res.Value;
				// console.debug("Results after " + dice.Results.Results.toString());
			}
		})
	});
	// Penetrating exploding dice works the same as regular exploding dice, but a -1 modifier is applied to every explode result
	static EXPLODING_PENETRATING = new this("Penetrating exploding", /!p(?:(?<symbol>[<>=]+)(?<target>\d+))?/g, (dice, target, mode) => {
		if (mode === null) {
			mode = DiceModMode.EQUAL;
			target = parseInt(dice.Size);
		}
		dice.Results.Results.forEach((dice_result) => {
			if (mode.compare(dice_result.Value, target)) {
				dice_result.AddDecorators(DiceResultDecorator.EXPLODED);
				// console.debug("Results before " + dice.Results.Results.toString());
				const res = dice.RollSingle();
				res.Results[0].Value -= 1;
				// console.warn("Exploded! " + dice.Results[i] + " + " + res + " => " + (dice.Results[i] + res) + "!");
				dice.Results.AddFromCollection(res);
				// console.debug("Results after " + dice.Results.Results.toString());
			}
		})
	});
	static EXPLODING_CASCADING = new this("Cascading exploding", /!c(?:(?<symbol>[<>=]+)(?<target>\d+))?/g, (dice, target, mode) => {
		if (mode === null) {
			mode = DiceModMode.EQUAL;
			target = parseInt(dice.Size);
		}
		dice.Results.Results.forEach((dice_result) => {
			if (mode.compare(dice_result.Value, target) && dice_result.Size > 4) {
				dice_result.AddDecorators(DiceResultDecorator.EXPLODED);
				// console.debug("Results before " + dice.Results.Results.toString());
				const reduced_size = DiceGroup.ReduceDieSize(dice_result.Size);
				if (reduced_size === null)
					return;
				const die = new DiceGroup({ size: reduced_size, modifiers: dice.Modifiers });
				const res = die.RollSingle();
				dice.Results.AddFromCollection(res);
				// console.debug("Results after " + dice.Results.Results.toString());
			}
		})
	})
	static EXPLODING = new this("Exploding", /!(?:(?<symbol>[<>=]+)(?<target>\d+))?/g, (dice, target, mode) => {
		if (mode === null)
			mode = DiceModMode.GREATER_OR_EQUAL;
		if (target === null)
			target = parseInt(dice.Size);
		let explode_count = 0;
		dice.Results.Results.forEach((dice_result) => {
			if (mode.compare(dice_result.Value, target)) {
				dice_result.AddDecorators(DiceResultDecorator.EXPLODED);
				// console.debug("Results before " + dice.Results.Results.toString());
				const res = dice.RollSingle();
				// console.warn("Explosion!");
				explode_count++;
				dice.Results.AddFromCollection(res);
				// console.debug("Results after " + dice.Results.Results.toString());
			}
		})
		// console.info(`Exploded ${explode_count} time${explode_count===1?"":"s"}!`);
	});
	static DROP_LOWEST = new this("Drop lowest", /dl(?<target>\d+)?/g, (dice, target) => {
		if (target === null)
			target = 1;
		let drop_count = 0;
		// console.debug("Starting", dice.Results);
		while (drop_count < target || drop_count === dice.Results.Results.length - 1) {
			let last_lowest = dice.Results.Results[0];
			dice.Results.Results.forEach((dice_result) => {
				if (!dice_result.HasDecorator(DiceResultDecorator.DROPPED) && dice_result.Value < last_lowest.Value) {
					last_lowest = dice_result;
				}
			})
			drop_count++;
			if (drop_count <= target) {
				last_lowest.AddDecorators(DiceResultDecorator.DROPPED);
				// console.debug("Drop " + last_lowest);
			}
		}
	});
	static DROP_HIGHEST = new this("Drop highest", /dh(?<target>\d+)?/g, (dice, target) => {
		if (target === null)
			target = 1;
		let drop_count = 0;
		// console.debug("Starting", dice.Results);
		while (drop_count < target || drop_count === dice.Results.Results.length - 1) {
			let last_highest = dice.Results.Results[0];
			dice.Results.Results.forEach((dice_result) => {
				if (!dice_result.HasDecorator(DiceResultDecorator.DROPPED) && dice_result.Value > last_highest.Value) {
					last_highest = dice_result;
				}
			})
			drop_count++;
			if (drop_count <= target) {
				// console.debug("Drop " + last_highest);
				last_highest.AddDecorators(DiceResultDecorator.DROPPED);
			}
		}
	});
	static KEEP_LOWEST = new this("Keep lowest", /kl(?<target>\d+)?/g, (dice, target) => {
		if (target === null)
			target = 1;
		let keep_count = 0;
		const keep_entries = [];
		while (keep_count < target || keep_count === dice.Results.Results.length - 1) {
			let last_lowest = dice.Results.Results[0];
			dice.Results.Results.forEach((dice_result) => {
				if (!dice_result.HasDecorator(DiceResultDecorator.DROPPED) && dice_result.Value < last_lowest.Value) {
					last_lowest = dice_result;
				}
			})
			keep_count++;
			// console.debug("Keep " + last_lowest);
			if (keep_count <= target) {
				keep_entries.push(last_lowest);
			}
		}
		dice.Results.Results.forEach((dice_result) => {
			if (!keep_entries.includes(dice_result)) {
				dice_result.AddDecorators(DiceResultDecorator.DROPPED);
			}
		})
	});
	static KEEP_HIGHEST = new this("Keep highest", /kh(?<target>\d+)?/g, (dice, target) => {
		if (target === null)
			target = 1;
		let keep_count = 0;
		let keep_entries = [];
		// console.debug("Starting", dice.Results);
		while (keep_count < target || keep_count === dice.Results.Results.length - 1) {
			let last_highest = dice.Results.Results[0];
			dice.Results.Results.forEach((dice_result) => {
				if (dice_result.Value > last_highest.Value) {
					last_highest = dice_result;
				}
			})
			keep_count++;
			if (keep_count <= target) {
				keep_entries.push(last_highest);
				// console.debug("Keep " + last_highest);
			}
		}
		dice.Results.Results.forEach((dice_result) => {
			if (!keep_entries.includes(dice_result))
				dice_result.AddDecorators(DiceResultDecorator.DROPPED);
		})
	});
	static KEEP = new this("keep", /kp(?:(?<symbol>[<>=]+)(?<target>\d+))?/g, (dice, target, mode) => {
		if (mode === null)
			mode = DiceModMode.GREATER_OR_EQUAL;
		if (target === null)
			target = dice.Size;
		dice.Results.Results.forEach((dice_result) => {
			if (!mode.compare(dice_result.Value, target))
				dice_result.AddDecorators(DiceResultDecorator.DROPPED);
		})
	});
	static DROP = new this("Drop", /dr(?:(?<symbol>[<>=]+)(?<target>\d+))?/g, (dice, target, mode) => {
		if (mode === null)
			mode = DiceModMode.LESSER_OR_EQUAL;
		if (target === null)
			target = 1;
		dice.Results.Results.forEach((dice_result) => {
			if (mode.compare(dice_result.Value, target))
				dice_result.AddDecorators(DiceResultDecorator.DROPPED);
		})
	});
	static REROLL_ONCE = new this("Reroll once", /ro(?:(?<symbol>[<>=]+)(?<target>\d+))?/g, (dice, target, mode) => {
		if (mode === null)
			mode = DiceModMode.LESSER_OR_EQUAL;
		if (target === null)
			target = 1;
		dice.Results.Results.forEach((dice_result) => {
			if (mode.compare(dice_result.Value, target)) {
				// console.debug("Reroll", dice_result);
				dice_result.AddDecorators(DiceResultDecorator.REROLLED);
				const res = dice.RollSingle([]);
				dice_result.Value = res.Sum();
			}
		})
	});
	static REROLL = new this("Reroll", /r(?:(?<symbol>[<>=]+)(?<target>\d+))?/g, (dice, target, mode) => {
		if (mode === null)
			mode = DiceModMode.LESSER_OR_EQUAL;
		if (target === null)
			target = 1;
		dice.Results.Results.forEach((dice_result) => {
			if (mode.compare(dice_result.Value, target)) {
				// console.debug("Reroll", dice_result);
				dice_result.AddDecorators(DiceResultDecorator.REROLLED);
				const res = dice.RollSingle([new DiceMod(this.REROLL, target, mode)]);
				dice_result.Value = res.Sum();
				dice_result.ReplacedValues.push(...res.Results[0].ReplacedValues);
			}
		})
	});
	static SUCCESS = new this("Successes", /(?<symbol>[>=]+)(?<target>\d+)/g, (dice, target, mode) => {
		dice.Results.Results.forEach((dice_result) => {
			if (mode.compare(dice_result.Value, target))
				dice_result.AddDecorators(DiceResultDecorator.SUCCESS);
		})
	});
	static FAILURE = new this("Failure", /(?<symbol>[<=]+)(?<target>\d+)/g, (dice, target, mode) => {
		dice.Results.Results.forEach((dice_result) => {
			if (mode.compare(dice_result.Value, target))
				dice_result.AddDecorators(DiceResultDecorator.FAILURE);
		})
	})

	/**
	 * @param {string} name
	 * @param {RegExp} pattern
	 * @param {function(dice:DiceGroup, targets:number, mode:DiceModMode)} action
	 */
	constructor(name, pattern = null, action = null) {
		this.name = name;
		this.pattern = pattern;
		this.action = action ?? function() {};
	}
	toString() {
		return this.name;
	}
	match(str) {
		if (typeof this.pattern === "undefined" || this.pattern === null)
			return null;
		const result = Array.from(str.matchAll(this.pattern));
		if (result.length === 0)
			return null;
		return result;
	}
}