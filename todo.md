* Character equipment slots
  * Single slot but expands to fit whatever size equipment is placed in it

* [ ] Refactor character creation
  * [ ] Implement saving and loading of characters (to backend)
    * [ ] Character changes are immediately saved.
  * [ ] Fields can be pinned from the full character sheet, which will display them on the compact sheet
    * [ ] There are two types of pins, normal and combat, combat pins are only displayed in combat mode and normal pins in normal mode
  * [ ] Add header array to FieldGroup
  * [ ] Enable referencing field keys in formulas
  * [ ] Enable editing field formulas for custom fields
  * [ ] Make sub-fields display properly in character sheet
  * [x] Creating a character should only ask for a name, the only static field in a character, and which ruleset to use for the character.
  * [x] When the character is created it is added to the roster (The main screen), it can be opened to be viewed and edited (this is the same thing)
  * [x] "Fields" are presented better, with categories to group them

* [ ] Finalize session implementation
  * [ ] Add character storage to session (save/load)
  * [ ] Implement character ownership
    * [ ] Display owner on character card
  * [ ] Implement popout for text inputs
    * [ ] Store history in localStorage
    * [ ] Popout should allow deleting entries from history
    * [ ] Remember past session IDs and show in popout on ID inputs