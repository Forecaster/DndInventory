
class DiceResultCollection {
	/** @var {DiceResult[]} */
	Results

	/**
	 * @param {DiceResult[]} results
	 */
	constructor(results = []) {
		this.Results = results;
	}

	toString() {
		let output = [];
		this.Results.forEach((result) => {
			output.push(result.toString())
		})
		return output.join(", ");
	}

	ToSimpleHTML() {
		const root = document.createElement("span");
		root.classList.add("simple_die");
		this.Results.forEach((result) => {
			root.appendChild(result.ToSimpleHTML());
		})
		return root;
	}

	/**
	 * @param {DiceResult} results
	 */
	AddResults(...results) {
		results.forEach((result) => {
			this.Results.push(result);
		})
	}

	/**
	 * @param {DiceResultCollection} collection
	 */
	AddFromCollection(collection) {
		collection.Results.forEach((result) => {
			this.AddResults(result);
		})
	}

	Clear() {
		this.Results = [];
	}

	/**
	 * @param {DiceResultDecorator[]} filter Values with decorators included in filter will not be added to sum.
	 * @returns {number}
	 */
	Sum(filter = [ DiceResultDecorator.DROPPED ]) {
		let sum = 0;
		this.Results.forEach((result) => {
			sum += result.Get(filter);
		})
		return sum;
	}

	/**
	 * @param {DiceResultDecorator[]} filter Values with decorators included in filter are counted.
	 * @return {number}
	 */
	Count(filter = [ DiceResultDecorator.SUCCESS ]) {
		let count = 0;
		this.Results.forEach((result) => {
			if (filter.includes(result.Decorator))
				count++;
		})
		return count;
	}
}