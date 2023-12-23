/**
 * @property EquipmentSlots
 */
class EquipmentSlotGroup {
	EquipmentSlots

	constructor(slots = []) {
		this.EquipmentSlots = [];
		slots.forEach((slot) => {
			this.EquipmentSlots.push(slot);
		})
	}

	AddSlot(slot) {
		if (typeof this.EquipmentSlots === "undefined" || this.EquipmentSlots === null)
			this.EquipmentSlots = [];
		this.EquipmentSlots.push(slot)
	}

	PopulateContainer(container) {
		this.EquipmentSlots.forEach((slot) => {
			container.appendChild(slot.CreateSlot());
		})
	}
}