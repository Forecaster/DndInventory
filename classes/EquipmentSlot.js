/**
 * @property {string} Name
 * @property {int} OffsetX
 * @property {int} OffsetY
 * @property {SlotType} Type
 */
class EquipmentSlot {
	Name
	OffsetX
	OffsetY
	Type

	/**
	 * @param {string} name
	 * @param {int} offset_x
	 * @param {int} offset_y
	 * @param {SlotType} type
	 */
	constructor(name, offset_x, offset_y, type = SlotType.Any) {
		this.Name = name;
		this.OffsetX = offset_x;
		this.OffsetY = offset_y;
		this.Type = type;
	}

	CreateSlot() {
		const slot = document.createElement("div");
		slot.classList.add("equipment_slot", "slot");
		slot.title = this.Name;
		slot.setAttribute("slot_type", this.Type)
		slot.style.top = this.OffsetY + "px";
		slot.style.left = this.OffsetX + "px";
		drag_handler.make_droppable(slot, { custom_on_drop: (event, handler) => {
			event.currentTarget.appendChild(handler.DraggingElement);
			handler.DraggingElement.style.top = "0";
			handler.DraggingElement.style.left = "0";
			Item.ScaleToSlot(handler.DraggingElement, event.currentTarget);
		} });
		return slot;
	}
}