/**
 * @property {string} Name
 * @property {string} Description
 * @property {string} HiddenDescription
 * @property {array} Shape
 * @property {float} Weight
 * @property {int} Price
 * @property {array} Modifiers
 * @property {float} Quantity This can be used to track the number of arrows in an arrow bundle
 * @property {int} MaxQuantity This is the maximum number of items in a stack. For most items this will be 1.
 * For certain items such as arrow bundles this can limit the number of arrows that the bundle can contain.
 * @property {SlotType[]} CompatibleSlots
 * @property {SlotType[]} BlocksSlots
 * @property {string} Icon
 */
class Item {
	Name
	FalseName
	Description
	FalseDescription
	Cursed
	Weight
	Shape
	Price
	Modifiers
	Quantity
	MaxQuantity
	CompatibleSlots
	BlocksSlots
	Icon

	/**
	 *
	 * @param {string} name
	 * @param {int} weight
	 * @param {array[]} shape
	 * @param {{ false_name:string,
	 * description:string,
	 * false_description:string,
	 * compatible_slots:SlotType[],
	 * blocks_slots:SlotType[],
	 * cursed:boolean,
	 * icon:string,
	 * quantity:int,
	 * max_quantity:int }} options
	 */
	constructor(name, weight = 1, shape = [[true]] , options = {}) {
		this.Name = name;
		this.FalseName = options.false_name || null;
		this.Weight = weight;
		this.Shape = shape;
		this.Description = options.description || "";
		this.FalseDescription = options.false_description || null;
		this.CompatibleSlots = options.compatible_slots || [SlotType.Any];
		this.BlocksSlots = options.blocks_slots || [];
		this.Cursed = options.cursed || false;
		this.Icon = options.icon || null;
		this.Quantity = options.quantity || null;
		this.MaxQuantity = options.max_quantity || null;
	}

	SetShape(shape) {
		this.Shape = shape;
	}

	GetWeightFromShape() {
		let total = 0;
		this.Shape.forEach((entry) => {
			entry.forEach((sub_entry) => {
				if (sub_entry === true)
					total++;
			})
		});
		return total;
	}

	#TestTile(x, y) {
		if (typeof this.Shape[y] !== "undefined")
			if (typeof this.Shape[y][x] !== "undefined")
				return this.Shape[y][x];
		return false;
	}

	GetTiles() {
		let div = document.createElement("div");
		div.className = "item";
		// div.title = this.Name;
		div.setAttribute("item_name", this.Name);
		div.style.width = (this.Shape[0].length * tile_width) + "px";
		div.style.height = (this.Shape.length * tile_height) + "px";
		const thisItem = this;
		div.onmouseover = function(event) {
			tooltip.SetContent(thisItem.Name, ["<b>Weight:</b> " + thisItem.Weight, "", thisItem.Description]);
			tooltip.SetPosition(event.clientX, event.clientY);
		}
		div.onmousemove = function(event) {
			tooltip.SetPosition(event.clientX, event.clientY);
		}
		div.onmouseout = function(event) {
			tooltip.Hide();
		}
		console.debug(div.ondrag);

		let title = document.createElement("div");
		title.classList.add("item_title");
		title.innerText = this.Name;
		div.appendChild(title);

		for (let y = 0; y < this.Shape.length; y++) {
			let row = this.Shape[y];
			for (let x = 0; x < row.length; x++) {
				let tile_state = row[x];
				let tile = document.createElement("div");
				tile.style.top = y * tile_height + "px";
				tile.style.left = x * tile_width + "px";
				if (tile_state === true)
					tile.className = "item_tile";
				else
					tile.className = "item_tile_blank";

				// Border setup
				if (this.#TestTile(x,y+1))
					tile.style.borderBottom = "none";
				if (this.#TestTile(x, y-1))
					tile.style.borderTop = "none";
				if (this.#TestTile(x+1,y))
					tile.style.borderRight = "none";
				if (this.#TestTile(x-1,y))
					tile.style.borderLeft = "none";

				div.appendChild(tile);
			}
		}

		if (this.Icon !== null) {
			title.style.display = "none";
			const icon = document.createElement("div");
			icon.classList.add("item_icon");
			icon.style.backgroundImage = "url('" + icons[this.Icon]['path'] + "')";
			icon.style.width = div.style.width;
			icon.style.height = div.style.height;
			div.appendChild(icon);
		}

		return div;
	}

	GetHTML(unlimited_items = false) {
		const div = this.GetTiles(unlimited_items);
		div.itemObject = this;
		drag_handler.make_draggable(div, { copy_element: unlimited_items, custom_on_start: (event, handler) => {
				handler.DraggingElement.itemObject = this;
				console.log("handler", handler);
				Item.ScaleReset(handler.DraggingElement);
				if (this.CompatibleSlots.length > 0) {
					if (this.CompatibleSlots.indexOf(SlotType.Any) === -1) {
						let slots = document.querySelectorAll(".slot");
						slots.forEach((slot) => {
							if (slot.hasAttribute("slot_type")) {
								const slot_type = SlotType.GetSlotTypeFromName(slot.getAttribute("slot_type"));
								console.debug("slot_type", slot_type);
								if (this.CompatibleSlots.indexOf(slot_type) === -1)
									slot.classList.add("blocked");
							}
						})
					} else {
						console.info("Item is compatible with any slot.");
					}
				}
			} });
		return div;
	}

	static ScaleToSlot(item, slot) {
		const slot_data = slot.getBoundingClientRect();
		if (parseInt(item.style.width) > parseInt(item.style.height)) {
			item.style.scale = (slot_data.width / parseInt(item.style.width)).toString();
		} else {
			item.style.scale = (slot_data.height / parseInt(item.style.height)).toString();
		}
	}

	static ScaleReset(item) {
		item.style.scale = null;
	}
}