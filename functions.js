
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

function parse_html_dice_string(str) {
	// console.log(str);
	str = str.replace(/<div.*>.*<\/div>/, "");
	str = str.replaceAll(/<dice_group.*?group_result>(-?\d+).*?<\/dice_group>/g, "$1");
	str = str.replaceAll(/<symbol>(.)<\/symbol>/g, "$1");
	str = str.replaceAll(/<text>(.*)<\/text>/g, "$1");
	str = str.replaceAll(/<die.*?><result>(\d+).*?<\/die>/g, "$1");
	// console.log(str);
	return str;
}

function is_math_expression(str) {
	if (str.match(/[-*+/^]+/) === null)
		return false;
	return true;
}

/**
 * Takes a math expression such as `1 + 1` or `(2 + 5) * 4` and calculates the result.
 * The following operators are supported: + - / * ^
 * Parenthesis can be used to group parts. PEMDAS is followed.
 * @param {string} str
 * @returns {number|string}
 */
function parse_math_expression(str) {
	str = str.replaceAll(" ", "");
	const pattern_groups = /([a-z]*)\((.*)\)/;
	const pattern_exponents = /(-?\d+)\^(-?\d+)/;
	const pattern_multiplication = /(-?\d+)\*(-?\d+)/;
	const pattern_division = /(-?\d+)\/(-?\d+)/;
	const pattern_add = /(-?\d+)\+(-?\d+)/;
	const pattern_sub = /(-?\d+)-(-?\d+)/;
	let groups = {};
	let group_pointer = 0;
	let match = true;
	while (match) {
		match = str.match(pattern_groups);
		if (match !== null) {
			let solved_group = parse_math_expression(match[2]);
			if (match[1] === "ceil")
				solved_group = Math.ceil(solved_group)
			else if (match[1] === "floor")
				solved_group = Math.floor(solved_group);
			else if (match[1] === "round")
				solved_group = Math.round(solved_group);
			str = str.replace(match[0], solved_group.toString());
		}
	}
	match = true;
	while (match) {
		match = str.match(pattern_exponents);
		if (match !== null) {
			str = str.replace(match[0], Math.pow(parseFloat(match[1]), parseFloat(match[2])).toString());
		}
	}
	match = true;
	while (match) {
		match = str.match(pattern_multiplication);
		if (match !== null) {
			str = str.replace(match[0], (match[1] * match[2]).toString());
		}
	}
	match = true;
	while (match) {
		match = str.match(pattern_division);
		if (match !== null) {
			str = str.replace(match[0], (match[1] / match[2]).toString());
		}
	}
	match = true;
	while (match) {
		match = str.match(pattern_add);
		if (match !== null) {
			str = str.replace(match[0], (parseFloat(match[1]) + parseFloat(match[2])).toString());
		}
	}
	match = true;
	while (match) {
		match = str.match(pattern_sub);
		if (match !== null) {
			str = str.replace(match[0], (match[1] - match[2]).toString());
		}
	}
	return parseFloat(str);
}

/**
 * @param {string} str
 * @param {string} subject
 * @param {{ [lowercase]:boolean }} [options]
 */
function str_contains(str, subject, options = {}) {
	const lowercase = options.lowercase ?? true;
	str = str.toString();
	if (lowercase) {
		str = str.toLowerCase();
		subject = subject.toLowerCase();
	}
	return str.indexOf(subject) !== -1;
}

/**
 * @param {string} str
 * @param {string} subject
 * @param {{ [lowercase]:boolean }} [options]
 */
function str_startswith(str, subject, options = {}) {
	const lowercase = options.lowercase ?? true;
	str = str.toString();
	if (lowercase) {
		str = str.toLowerCase();
		subject = subject.toLowerCase();
	}
	return str.indexOf(subject) === 0;
}

/**
 * @param {string} str
 * @param {string} subject
 * @param {{ [lowercase]:boolean }} [options]
 */
function str_endswith(str, subject, options = {}) {
	const lowercase = options.lowercase ?? true;
	str = str.toString();
	if (lowercase) {
		str = str.toLowerCase();
		subject = subject.toLowerCase();
	}
	return str.indexOf(subject) === str.length - subject.length;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 *
 * From https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
 */
function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Uses a temporary element to convert a color value into RGB.
 * If an invalid color is given the values for white will be returned.
 * @param {string} color
 * @returns {int[]}
 */
function getRgbValuesFrom(color) {
	const div = document.createElement("div");
	div.style.color = color;
	div.style.display = "none";
	document.body.appendChild(div);
	const rgb = window.getComputedStyle(div).color;
	const match = rgb.match(/rgb\((\d+), (\d+), (\d+)\)/);
	document.body.removeChild(div);
	return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
}

// <editor-fold desc="Contrast calculation">
const RED = 0.2126;
const GREEN = 0.7152;
const BLUE = 0.0722;

const GAMMA = 2.4;

function luminance(r, g, b) {
	const a = [r, g, b].map((v) => {
		v /= 255;
		return v <= 0.03928
			? v / 12.92
			: Math.pow((v + 0.055) / 1.055, GAMMA);
	});
	return a[0] * RED + a[1] * GREEN + a[2] * BLUE;
}

function contrast(rgb1, rgb2) {
	const lum1 = luminance(...rgb1);
	const lum2 = luminance(...rgb2);
	const brightest = Math.max(lum1, lum2);
	const darkest = Math.min(lum1, lum2);
	return (brightest + 0.05) / (darkest + 0.05);
}
// </editor-fold>

/**
 * @param {string} base The base color
 * @param {string} eval One or more colors to compare against the base color
 */
function returnHighestContrast(base, ...eval) {
	const base_rgb = getRgbValuesFrom(base);
	let highest_contrast = 0;
	let highest_eval = null;
	eval.forEach((color) => {
		const color_rgb = getRgbValuesFrom(color);
		const cont = contrast(base_rgb, color_rgb);
		if (cont > highest_contrast) {
			highest_contrast = cont;
			highest_eval = color;
		}
	})
	return highest_eval;
}
