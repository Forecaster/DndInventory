/**
 * @property {Item[]} Items
 * @property {float} PriceModifier
 */
class ItemSpawner {
	Items
	PriceModifier

	constructor(items, price_modifier = 1) {
		this.Items = items;
		this.PriceModifier = price_modifier;
	}

	/**
	 * @param {HTMLElement} container
	 */
	PopulateContainer(container) {
		console.debug(this.Items);
		this.Items.forEach((item) => {
			console.debug("PopulateContainer", item);
			const span = document.createElement("span");
			span.style.margin = "4px";
			span.appendChild(item.GetHTML(item.Quantity === null));
			container.appendChild(span);
		});
	}
}