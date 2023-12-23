/**
 * @property {string} Name
 * @property {int} Width
 * @property {int} Height
 * @property {{ width: int, height:int, color:string }[]} Sectors
 * @property {"vertical"|"horizontal"} SectorDirection
 * @property {array} Contents
 */
class Inventory {
	Name
	Width
	Height
	Sectors
	SectorDirection
	Ruleset
	Contents

	/**
	 * @param {string} name
	 * @param { {sectors: { width:int, height:int, color:string }[], sector_direction:string} } options
	 */
	constructor(name, options) {
		this.Name = name;
		this.Ruleset = null;
		this.Contents = [];
		this.Sectors = options.sectors || [];
		this.SectorDirection = options.sector_direction || "horizontal";
	}

	PopulateContainer(container) {
		container.title = this.Name;
		for (let sector in this.Sectors) {
			for (let y = 0; y < this.Height; y++) {
				const row = document.createElement("div");
				row.className = "inventory_tile_row";
				container.appendChild(row);
				for (let x = 0; x < this.Width; x++) {
					let tile = document.createElement("div");
					tile.setAttribute("x", x.toString());
					tile.setAttribute("y", y.toString());
					tile.classList.add("inventory_tile", "level1", "slot");
					row.appendChild(tile);

					drag_handler.make_droppable(tile, { custom_on_drop: (event, handler) => {
						console.debug(event.currentTarget, handler.DraggingElement);
						event.currentTarget.appendChild(handler.DraggingElement);
						handler.DraggingElement.style.pointerEvents = null;
						handler.DraggingElement.style.top = "-1px";
						handler.DraggingElement.style.left = "-1px";
					} });
				}
			}
		}
		console.debug(container);
		console.debug(`Generated inventory HTML with ${this.Width * this.Height} tiles.`);
	}
}