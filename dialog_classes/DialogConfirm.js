
class DialogConfirm extends Dialog {
	/** @var {{ label:string, color:string, callback:function }[]} */
	Options

	/**
	 * @param {string} title
	 * @param {{ label:string, color:string, callback:function }[]}options
	 */
	Open(title, options = null) {
		const title_element = this.DialogElement.querySelector("#confirm_title");
		title_element.innerHTML = title;
		this.Options = options;
		const container = this.DialogElement.querySelector("#confirm_container");
		container.innerHTML = "";

		let row = document.createElement("div");
		row.className = "row";
		container.appendChild(row);

		this.Options.forEach((option) => {
			let col = document.createElement("div");
			col.className = "col center";
			row.appendChild(col);

			let button = document.createElement("button");
			button.className = "btn btn-" + option.color;
			button.innerText = option.label;
			button.onclick = (event) => {
				this.Close();
				if (typeof option.callback === "function")
					option.callback();
			};
			col.appendChild(button);
		});
		super.Open();
	}
}