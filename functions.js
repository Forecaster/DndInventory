
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