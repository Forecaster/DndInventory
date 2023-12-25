
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