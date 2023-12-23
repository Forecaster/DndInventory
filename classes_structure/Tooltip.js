
class Tooltip {
	Element

	constructor() {
		this.Element = document.createElement("div");
		this.Element.classList.add("tooltip");
		this.Element.style.top = "-1000px";
		this.Element.style.left = "0";
		document.body.appendChild(this.Element);
	}

	SetPosition(x, y) {
		this.Element.style.top = y + "px";
		this.Element.style.left = x + 20 + "px";
	}

	SetContent(title, lines) {
		this.Element.innerHTML = `<title>${title}</title><tt_body>${lines.join("<br/>")}</tt_body>`;
	}

	Hide() {
		this.Element.style.top = "-1000px";
		this.Element.style.left = "0";
	}
}