
class DiceModMode {
	static GREATER = new this("Greater than", ">", (a, b) => { return a > b });
	static LESSER = new this("Lesser than", "<", (a, b) => { return a < b });
	static EQUAL = new this("Equal to", "=", (a, b) => { return a === b});
	static GREATER_OR_EQUAL = new this("Equal to or greater than", ">=", (a, b) => { return a >= b });
	static LESSER_OR_EQUAL = new this("Equal to or lesser than", "<=", (a, b) => { return a <= b });

	/**
	 * @param {string} name
	 * @param {string} symbol
	 * @param {function(a:number, b:number):boolean} compare
	 */
	constructor(name, symbol, compare) {
		this.name = name;
		this.symbol = symbol;
		this.compare = compare;
	}
	toString() {
		return this.name;
	}
	static get_by_mod(symbol) {
		for (let mode in DiceModMode) {
			if (DiceModMode[mode].symbol === symbol)
				return DiceModMode[mode];
		}
		return null;
	}
}