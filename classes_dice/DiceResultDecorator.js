
class DiceResultDecorator {
	static EXPLODED = new this("Exploded", "exploded");
	static DROPPED = new this("Dropped", "dropped");
	static SUCCESS = new this("Success", "success");
	static FAILURE = new this("Failure", "failure");
	static CRIT_SUCCESS = new this("Critical success", "crit_success");
	static CRIT_FAILURE = new this("Critical failure", "crit_failure");
	static REROLLED = new this("Rerolled", "rerolled");

	constructor(name, cl) {
		this.name = name;
		this.class = cl;
		this.count = 1;
	}

	toString() {
		return this.name;
	}
}