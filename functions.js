
function success_output(element, msg) {
	element.classList = ["success_output"];
	element.innerText = msg;
}

function error_output(element, msg) {
	element.classList = ["error_output"];
	element.innerText = msg;
}

function refresh_characters() {
	character_container.innerHTML = "";
	characters.forEach((character) => {
		let char_element = character.GetCompactElement();
		character_container.appendChild(char_element);
	})
}

function unique_id(length = 16) {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	let counter = 0;
	while (counter < length) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
		counter += 1;
	}
	return result;
}

function match(t, s, lowercase = false) {
	if (lowercase) {
		if (typeof t === "string")
			t = t.toLowerCase();
		if (typeof s === "string")
			s = s.toLowerCase();
	}
	return t === s;
}

/**
 * Takes a math formula such as `1 + 1` or `(2 + 5) * 4` and calculates the result.
 * The following operators are supported: + - / * ^
 * Parenthesis can be used to group parts. PEMDAS is followed.
 * @param {string} input_string
 * @returns {number}
 */
function parse_math_string(input_string) {
	input_string = input_string.replaceAll(" ", "");
	const pattern_groups = /\((.*)\)/;
	const pattern_exponents = /(\d+)\^(\d+)/;
	const pattern_multiplication = /(\d+)\*(\d+)/;
	const pattern_division = /(\d+)\/(\d+)/;
	const pattern_add = /(\d+)\+(\d+)/;
	const pattern_sub = /(\d+)-(\d+)/;
	let groups = {};
	let group_pointer = 0;
	let match = true;
	while (match) {
		match = input_string.match(pattern_groups);
		if (match !== null) {
			const solved_group = parse_math_string(match[1]);
			input_string = input_string.replace(match[0], solved_group.toString());
		}
	}
	match = true;
	while (match) {
		match = input_string.match(pattern_exponents);
		if (match !== null) {
			input_string = input_string.replace(match[0], Math.pow(parseFloat(match[1]), parseFloat(match[2])).toString());
		}
	}
	match = true;
	while (match) {
		match = input_string.match(pattern_multiplication);
		if (match !== null) {
			input_string = input_string.replace(match[0], (match[1] * match[2]).toString());
		}
	}
	match = true;
	while (match) {
		match = input_string.match(pattern_division);
		if (match !== null) {
			input_string = input_string.replace(match[0], (match[1] / match[2]).toString());
		}
	}
	match = true;
	while (match) {
		match = input_string.match(pattern_add);
		if (match !== null) {
			input_string = input_string.replace(match[0], (parseFloat(match[1]) + parseFloat(match[2])).toString());
		}
	}
	match = true;
	while (match) {
		match = input_string.match(pattern_sub);
		if (match !== null) {
			input_string = input_string.replace(match[0], (match[1] - match[2]).toString());
		}
	}
	return parseFloat(input_string);
}

/**
 * @param {string} str
 * @param {string} subject
 * @param {{ [lowercase]:boolean }} [options]
 */
function str_contains(str, subject, options = {}) {
	const lowercase = options.lowercase ?? true;
	if (lowercase) {
		str = str.toLowerCase();
		subject = subject.toLowerCase();
	}
	return str.indexOf(subject) !== -1;
}
