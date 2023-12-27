* Character equipment slots
  * Single slot but expands to fit whatever size equipment is placed in it

* Controls and forms
  * [ ] Implement a dropdown field
  * [ ] Implement searchable dropdown field
  * [ ] Fields should be usable outside of characters
    * [ ] Enable styling the inputs differently by allowing custom classes
  * [ ] Add dice roller widget (get dice values from ruleset along with common modifiers (advantage, disadvantage, etc)?)
    * [ ] Add ability to apply result of dice to field (drag n drop?)
  * [ ] Implement log history panel that shows past notifications for the session
    * [ ] Open-able through icon in the top right where notifications appear
  * [ ] Implement FieldRow (formerly RepeatableFieldGroup)
    * [ ] A template contains one or more fields
    * [ ] Values are stored in as an array
    * [ ] FieldRow can have a key
      * [ ] Keys can accept an index by appending `(n)` to the end, this can be used to access array values
        * [ ] For array values references without an index the array should be joined with `,` before being returned as a string

* Refactor characters
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
  * [ ] Allow updating a characters fields from a ruleset, which will try to match fields, and failing that will ask the user to map fields together
  * [x] Allow specifying custom controls in ruleset, such as "Take damage" for 5E, which would first remove temp. hp, then add wounds equal to the remaining damage
  * [ ] Fix field interactions (multiple characters with the same fields in the card would cause cross-updating)
  * [ ] Implement field formulas (referencing other fields to calculate values)
    * [ ] To view/edit the formula a small button should be present on the field (shown on hover), clicking the button shows a popover with a textarea to edit the field
      * [ ] The formula popover could have a list of keys on the side for quick reference, clicking a key inserts it into the textarea at the cursor
    * [ ] Field using formula will not allow manual editing
  * [ ] Implement field key interactions (when field changes, update other fields that use the key)

* [ ] Finalize session implementation
  * [x] Add character storage to session (save/load)
  * [x] Implement character ownership
    * [x] Display owner on character card
  * [ ] Implement popout for text inputs
    * [x] Store history in localStorage
    * [ ] Popout should allow deleting entries from history
    * [x] Remember past session IDs and show in popout on ID inputs