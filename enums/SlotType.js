
class SlotType {
	Name

	static Any = new SlotType("Any");
	static HeadFull = new SlotType("Head Full");
	static HeadTop = new SlotType("Head Top");
	static Face = new SlotType("Face");
	static Eyes = new SlotType("Eyes");
	static LowerFace = new SlotType("Lower Face");

	static Body = new SlotType("Body");
	static Torso = new SlotType("Torso");
	static Back = new SlotType("Back");
	static Arms = new SlotType("Arms");
	static Hands = new SlotType("Hands");
	static Legs = new SlotType("Legs");
	static Feet = new SlotType("Feet");

	static Ring = new SlotType("Ring");

	static Weapon = new SlotType("Weapon");
	static Shield = new SlotType("Shield");

	constructor(name) {
		this.Name = name;
	}

	toString() {
		return this.Name;
	}

	static GetSlotTypeFromName(name) {
		for (const prop in this) {
			if (this[prop].Name === name)
				return this[prop];
		}
		return null;
	}
}