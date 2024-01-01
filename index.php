<?php
$files = [];

foreach (glob("images/game-icons/*/*.png") as $f) {
	list($name, $ext) = explode(".", basename($f));
	$files[$name] = [ "path" => $f, "filename" => basename($f), "name" => $name, "ext" => $ext ];
}
?>


<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>DnD Inventory Tracker</title>

	<!-- General references -->
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4bw+/aepP/YC94hEpVNVgiZdgIC5+VKNBQNGCHeKRQN+PtmoHDEXuppvnDJzQIu9" crossorigin="anonymous" />
	<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-HwwvtgBNo3bZJJLYd8oVXjrBZt8cqVSpeBNS5n7C8IVInixGAoxmnlMuBnhbgrkm" crossorigin="anonymous"></script>
	<script src="/libraries_javascript/jquery.min.js"></script>
	<script src="/libraries_javascript/popper.min.js"></script>
	<script src="libraries/peerjs.min.js"></script>
	<link rel="stylesheet" href="styles/main.css" />
	<link rel="stylesheet" href="styles/inputs.css" />
	<link rel="stylesheet" href="styles/inventory.css" />
	<link rel="stylesheet" href="styles/character.css" />
	<link rel="stylesheet" href="styles/menu.css" />
	<link rel="stylesheet" href="styles/console.css" />
	<link rel="stylesheet" href="styles/dice.css" />

	<script src="functions.js"></script>

	<!-- Enums -->
	<script src="enums/CharacterSize.js"></script>
	<script src="enums/SlotType.js"></script>

	<!-- Classes -->
	<script src="classes_structure/API.js"></script>
	<script src="classes_structure/Drag_n_drop.js"></script>
	<script src="classes_structure/ItemSpawner.js"></script>
	<script src="classes_structure/Notifications.js"></script>
	<script src="classes_structure/Tooltip.js"></script>
	<script src="classes_structure/PopoutElement.js"></script>
	<script src="classes_structure/ClientConsole.js"></script>
	<script src="classes_data/PeerJsConnection.js"></script>
	<script src="classes_data/KeyStore.js"></script>
	<script src="classes_data/Serializable.js"></script>
	<script src="classes_data/Character.js"></script>
	<script src="classes_data/CharacterHealth.js"></script>
	<script src="classes_data/Inventory.js"></script>
	<script src="classes_data/Item.js"></script>
	<script src="classes_data/EquipmentSlot.js"></script>
	<script src="classes_data/EquipmentSlotGroup.js"></script>
	<script src="classes_data/Session.js"></script>
	<script src="classes_data/Field.js"></script>
	<script src="classes_data/FieldText.js"></script>
	<script src="classes_data/FieldNumber.js"></script>
	<script src="classes_data/FieldCheckbox.js"></script>
	<script src="classes_data/FieldGroup.js"></script>

	<!-- Dice classes -->
	<script src="classes_dice/DiceStringParser.js"></script>
	<script src="classes_dice/DiceModType.js"></script>
	<script src="classes_dice/DiceModMode.js"></script>
	<script src="classes_dice/DiceMod.js"></script>
	<script src="classes_dice/DiceGroup.js"></script>
	<script src="classes_dice/DiceResult.js"></script>
	<script src="classes_dice/DiceResultDecorator.js"></script>
	<script src="classes_dice/DiceResultCollection.js"></script>

	<!-- Dialog classes -->
	<script src="dialog_classes/Dialog.js"></script>
	<script src="dialog_classes/DialogConfirm.js"></script>
	<script src="dialog_classes/DialogAction.js"></script>
	<script src="dialog_classes/DialogSession.js"></script>
	<script src="dialog_classes/DialogCreateCharacter.js"></script>
	<script src="dialog_classes/DialogCharacterSheet.js"></script>
	<script src="dialog_classes/DialogSessionCreateJoin.js"></script>
	<script src="dialog_classes/DialogSessionCreate.js"></script>
	<script src="dialog_classes/DialogSessionLoad.js"></script>
	<script src="dialog_classes/DialogSessionJoin.js"></script>

	<!-- Enums #2 -->
	<script src="enums/Ruleset.js"></script>
</head>
<body>
<div id="notification_container" class="notifications_container" popover></div>
<div id="popout_character_notes" popover></div>
<div id="popout_formula" popover></div>
<dialog id="dialog_confirm" class="dialog">
	<h2 id="confirm_title">Confirm title</h2>
	<div id="confirm_container">
	</div>
</dialog>
<dialog id="dialog_action" class="dialog">
	<h4 id="dialog_action_title"></h4>
	<table id="dialog_action_fields"></table>
	<div style="margin-top: 20px;">
		<span class="btn btn-primary" id="dialog_action_go">TAKE ACTION</span>
		<span class="btn btn-secondary" id="dialog_action_cancel">CLOSE</span>
	</div>
</dialog>
<!-- <editor-fold desc="Dialogs session"> -->
<dialog id="session_create_join" class="dialog">
	<div style="text-align: center;"><h2>Session</h2></div>
	<div style="text-align: center;">
		<div style="display: inline-block; border: 1px dashed black; margin: 5px; padding: 15px; border-radius: 15px;">
			<div style="margin-bottom: 10px;" class="h5 b">GM <span style="font-weight: normal;">or</span> Solo player</div>
			<div>
				<button id="session_create_open" class="btn btn-danger btn-lg">Create</button>
				<button id="session_load_open" class="btn btn-warning btn-lg">Load</button>
			</div>
		</div>
		<div style="display: inline-block; border: 1px dashed black; margin: 5px; padding: 15px; border-radius: 15px;">
			<div style="margin-bottom: 10px;" class="h5 b">Multiplayer</div>
			<div>
				<button id="session_join_open" class="btn btn-primary btn-lg">Join</button>
			</div>
		</div>
	</div>
</dialog>
<dialog id="session_create" class="dialog">
	<div id="close" class="close_button"></div>
	<div style="text-align: center"><h2>Create session</h2></div>
	<div class="b"><label for="session_create_id">Session ID:</label></div>
	<div class="sm-text">Your players will use this to join. This is randomly generated. Also used to load sessions.</div>
	<div style="margin-bottom: 8px;"><input type="text" class="form-control" id="session_create_id" placeholder="Session ID" readonly /></div>
	<div class="b"><label for="session_create_gm_pwd">GM Password:</label></div>
	<div class="sm-text">This password is used when loading a session. Only you should know this.</div>
	<div style="margin-bottom: 8px;"><input type="text" class="form-control" id="session_create_gm_pwd" placeholder="Session GM password" /></div>
	<div class="b"><label for="session_create_name">Session name:</label></div>
	<div class="sm-text">Write something recognizable, so they can tell they're joining the right session.</div>
	<div style="margin-bottom: 8px;"><input type="text" class="form-control" id="session_create_name" placeholder="Session name" /></div>
	<div class="b"><label for="session_create_pwd">Session password:</label></div>
	<div class="sm-text">This password is what your players will use when joining the session.</div>
	<div style="margin-bottom: 8px;"><input type="text" class="form-control" id="session_create_pwd" placeholder="Session password" /></div>
	<div class="b"><label for="session_create_ruleset">Ruleset:</label></div>
	<div style="margin-bottom: 8px;"><select class="form-control" id="session_create_ruleset"></select></div>
	<div id="session_create_ruleset_encumbrance_option_hider" style="display: none;">
		<div class="b"><label for="session_create_encumbrance_option">Encumbrance options:</label></div>
		<div style="margin-bottom: 8px;"><select class="form-control" id="session_create_encumbrance_option"></select></div>
	</div>
	<div style="text-align: center"><button id="session_create_button" class="btn btn-primary">Create session</button></div>
	<div id="output"></div>
</dialog>
<dialog id="session_load" class="dialog">
	<div id="close" class="close_button"></div>
	<div style="text-align: center;"><h2>Load session</h2></div>
	<div class="b"><label for="session_load_id">Session ID:</label></div>
	<div class="sm-text">Enter the ID of the session you wish to load.</div>
	<div style="margin-bottom: 8px;"><input type="text" class="form-control" id="session_load_id" placeholder="Session ID" /></div>
	<div class="b"><label for="session_load_pwd">GM password:</label></div>
	<div class="sm-text">Enter the password that was set as the GM password when the session was created.</div>
	<div style="margin-bottom: 8px;"><form><input type="password" class="form-control" id="session_load_pwd" placeholder="Session password" autocomplete="off" /></form></div>
	<div class="b"><label for="session_load_session_length">Session length:</label></div>
	<div class="sm-text">Only use long or very long on your own devices!</div>
	<div style="margin-bottom: 8px;">
	<select id="session_load_session_length" class="form-control">
		<option value="short">Short (4 hours)</option>
		<option value="medium" selected="selected">Medium (1 day)</option>
		<option value="long">Long (1 month)</option>
		<option value="very_long">Very long (1 year)</option>
	</select>
	</div>
	<div style="text-align: center;"><button id="session_load_button" class="btn btn-primary">Load</button></div>
</dialog>
<dialog id="session_join" class="dialog">
	<div id="close" class="close_button"></div>
	<div style="text-align: center"><h2>Join session</h2></div>
	<div class="b"><label for="session_join_player_name">Player name:</label></div>
	<div class="sm-text">Enter your name. Make sure you use the same name each time to access existing characters owned by you.</div>
	<div style="margin-bottom: 8px;"><input type="text" class="form-control" id="session_join_player_name" placeholder="Player name" /></div>
	<div class="b"><label for="session_join_id">Session ID:</label></div>
	<div class="sm-text">Enter the ID of the session you wish to join given to you by your GM.</div>
	<div style="margin-bottom: 8px;"><input type="text" class="form-control" id="session_join_id" placeholder="Session ID" /></div>
	<div class="b"><label for="session_join_pwd">Session password:</label></div>
	<div style="margin-bottom: 8px;"><form><input type="password" class="form-control" id="session_join_pwd" placeholder="Session password" autocomplete="off" /></form></div>
	<div style="text-align: center;"><button id="session_join_button_join" class="btn btn-primary save_button">Join</button></div>
</dialog>
<!-- </editor-fold> -->
<!-- <editor-fold desc="Dialogs characters"> -->
<dialog id="create_character" class="dialog">
	<div id="close" title="Close" class="close_button" onclick="dialog_create_character.Close();"></div>
	<h2 class="center">Create character</h2>
	<div class="row">
		<div class="col-3"><label for="dialog_create_character_name">Name:</label></div>
		<div class="col"><input id="dialog_create_character_name" class="form-control" placeholder="Character name" /></div>
	</div>
	<div class="divider"></div>
	<div class="center"><button class="btn btn-primary" onclick="dialog_create_character.Save();">Create character</button></div>
</dialog>
<dialog id="character_sheet" class="dialog character_sheet">
	<div id="close" title="Close" class="close_button" onclick="dialog_character_sheet.Close();"></div>
	<h2 class="center">Character Sheet</h2>
	<div id="field_container" class="field_container"></div>
</dialog>
<!-- </editor-fold> -->
<div id="console" class="console"></div>
<div id="menu_top" class="menu_top">
	<div id="clock_real" class="clock_real"></div>
</div>
<div id="menu_side" class="menu_side">
	<div class="menu_button" onclick="dialog_create_character.Open();">New Character</div>
<!--	<div class="menu_button">Items</div>-->
	<div class="menu_divider"></div>
	<div class="menu_label">Actions</div>
	<div id="menu_container_actions"></div>
	<div class="menu_end">
		<div class="menu_button">Console</div>
		<div class="menu_button" onclick="session.Leave();">Leave session</div>
	</div>
</div>
<div class="main_container">
<!--	<div id="equipment_container" style="background-image: url('images/character.png'); width: 408px; height: 503px; position: relative; float: left;"></div>-->
	<div id="character_container" class="character_container">
		<div>Either there's nobody here or everyone rolled high stealth...</div>
	</div>
	<div id="test">
	</div>
</div>
<div id="shop" style="position: fixed; top: 10px; right: 10px;"></div>
</body>
</html>

<script>
	const icons = JSON.parse('<?= json_encode($files) ?>');

	const _ = null;
	const x = true;
	const tile_width = 30;
	const tile_height = 30;

	// <editor-fold desc="Elements">
	const character_container = document.querySelector("#character_container");
	const input_strength_slider = document.querySelector("#input_strength_slider");
	const input_strength = document.querySelector("#input_strength");
	const shop = document.querySelector("#shop");
	const equipment_container = document.querySelector("#equipment_container");
	// </editor-fold>

	// <editor-fold desc="Notifications">
	const notifications = new Notifications("#notification_container");
	// </editor-fold>

	// <editor-fold desc="Client console">
	const client_console = new ClientConsole("#console", {
		message_handler: message => {
			client_console.AddMessage(session.GetUserName() + ": " + message);
			peer.SendMessage(message, session.GetUserName());
		}
	});
	client_console.AddCommand("roll", {
		description: "Rolls dice. Ex: 2d20",
		action: function(args) {
			const dice_string = args.join(" ");
			/** @var {DiceStringParser} */
			const parsed = DiceStringParser.ParseDiceString(dice_string);

			parsed.Roll();
			let str = parsed.GetFormattedString();
			let result = "";
			if (is_math_expression(str))
				result = " => " + parse_math_expression(parse_html_dice_string(str));
			const display = parsed.GetFormattedString({ simple_html_format: true });
			console.debug(display);
			console.debug(str);
			client_console.AddMessage(display + result);
			const dice_html = parsed.GetFormattedString({full_html_format: true, append_sum: true});
			notifications.Dice(dice_html, {duration: 0});
			peer.SendEvent(PeerJsEvent.DIE_ROLL, { dice_fancy: dice_html, dice_plain: display, sender: session.GetUserName() });
		}
	});
	client_console.AddAliasForCommand("roll", "dice");
	// </editor-fold>

	// <editor-fold desc="PeerJsConnection">
	PeerJsEvent.DIE_ROLL = new PeerJsEvent("Die roll");
	PeerJsEvent.CHARACTER_UPDATE = new PeerJsEvent("Character update");

	const peer = new PeerJsConnection({
		message_handler: (message, sender) => {
			client_console.AddMessage(sender + ": " + message);
		},
		custom_event_handler: event => {
			if (event === PeerJsEvent.DIE_ROLL) {
				notifications.Dice(event.event_data.dice_fancy, { duration: 0, sender: event.event_data.sender });
				client_console.AddMessage(event.event_data.sender + " rolled " + event.event_data.dice_plain);
			} else if (event === PeerJsEvent.CHARACTER_UPDATE) {
				session.SyncCharacters();
			} else if (event === PeerJsEvent.CONFIRM_CONNECT) {
				notifications.Success(event.event_data + " connected!");
			} else if (event === PeerJsEvent.HOST_CONNECT) {
				notifications.Success("Connected to GM!");
			}
		},
		confirm_connect_data: () => {
			return session.CurrentUsername;
		}
	});
	// </editor-fold>

	// <editor-fold desc="Dialogs">
	function shift_notification_container() {
		notifications.Shift();
	}

	const dialog_session_create_join = new DialogSessionCreateJoin("#session_create_join", { post_open: shift_notification_container });
	const dialog_session_create = new DialogSessionCreate("#session_create", { external_buttons: { open: [ "#session_create_open" ] }, post_open: shift_notification_container });
	const dialog_session_load = new DialogSessionLoad("#session_load", { external_buttons: { open: [ "#session_load_open" ] }, post_open: shift_notification_container });
	const dialog_session_join = new DialogSessionJoin("#session_join", { external_buttons: { open: [ "#session_join_open" ] }, post_open: shift_notification_container });

	const dialog_create_character = new DialogCreateCharacter("#create_character", { post_open: shift_notification_container });
	const dialog_character_sheet = new DialogCharacterSheet("#character_sheet", { post_open: shift_notification_container });

	const dialog_confirm = new DialogConfirm("#dialog_confirm");
	const dialog_action = new DialogAction("#dialog_action");
	// </editor-fold>

	// <editor-fold desc="Notes popout">
	const textarea_notes = document.createElement("textarea");
	let textarea_notes_timeout = null;
	textarea_notes.classList.add("character_notes_input");
	textarea_notes.addEventListener("keydown", (event) => {
		clearTimeout(textarea_notes_timeout);
		textarea_notes_timeout = setTimeout(() => {
			/** @var {Character} popout_character_notes.Target */
			popout_character_notes.Target.Notes = event.target.value;
			popout_character_notes.Target.PrimeUpload();
		}, 2 * 1000);
	});
	const popout_character_notes = new PopoutElement("#popout_character_notes", {
		elements: [ textarea_notes ],
		callbacks: {
			show: () => {
				textarea_notes.value = popout_character_notes.Target.Notes;
			}
		}
	});
	// </editor-fold>

	// <editor-fold desc="Formula popout">
	const formula_label = document.createElement("label");
	formula_label.innerText = "Formula";
	const formula_field = document.createElement("input");
	formula_field.classList.add("field-input");
	formula_field.style.width = "98%";
	formula_field.addEventListener("keyup", (event) => {
		popout_formula.Target.UserFormula = event.target.value;
		popout_formula.Target.ParseFormula();
		popout_formula.Target.GetParentCharacter().PrimeUpload();
	})
	const formula_button_reset = document.createElement("div");
	formula_button_reset.innerText = "Reset";
	formula_button_reset.title = "Removes user formula and restores default (or no) formula.";
	formula_button_reset.addEventListener("click", (event) => {
		popout_formula.Target.UserFormula = null;
		formula_field.value = popout_formula.Target.Formula;
		popout_formula.Target.ParseFormula();
		popout_formula.Target.GetParentCharacter().PrimeUpload();
	})
	const popout_formula = new PopoutElement("#popout_formula", {
		elements: [ formula_label, formula_field, formula_button_reset ],
		callbacks: {
			show: () => {
				formula_label.innerText = "Formula for " + popout_formula.Target.Label;
				formula_field.value = popout_formula.Target.UserFormula ?? popout_formula.Target.Formula ?? "";
			}
		}
	})
	// </editor-fold>

	const clock_real = document.querySelector("#clock_real");

	// <editor-fold desc="Clock timer">
	setInterval(() => {
		const date = new Date();
		let hours = date.getHours();
		let min = date.getMinutes();
		let am = "AM";
		if (hours >= 13) {
			hours -= 12;
			am = "PM";
		}
		if (min.toString().length === 1)
			min = "0" + min;
		clock_real.innerText = `${hours}:${min} ${am}`;
	}, 100);
	// </editor-fold>

	// <editor-fold desc="Setup variables">
	/** @var {Session} */
	let session = new Session({ on_session_start: () => {
		if (session.CurrentUsername === null) {
			peer.RegisterHost(session.ID);
		} else {
			peer.ConnectToHost(session.ID);
		}
	}})
	/** @var {Character[]} */
	let characters = [];
	let fields = [];
	let current_pin_group = "default";
	KeyStore.Enabled = true; // FieldStore is disabled by default to prevent adding fields from rulesets.
	// </editor-fold>

	const drag_handler = new Drag_n_drop({ on_drag_end: (event, handler) => {
		document.querySelectorAll(".blocked").forEach((item) => {
			item.classList.remove("blocked");
		})
	} });
	const tooltip = new Tooltip();

	const active_ruleset = Ruleset.Dnd5e;

	dialog_session_create_join.Open();

	//<editor-fold desc="Inventory testing">
	const candle = new Item("Candle", 1, [[x,x]]);
	const potion = new Item("Potion of Healing", 1, [[x]], { description: "You regain 2d4 + 2 hit points when you drink this potion. The potion's red liquid glimmers when agitated.",
		icon: "round-potion",
		quantity: 5
	});
	const axe = new Item("Axe", 4, [[x,x],[_,x],[_,x]], { description: "It just wants to axe you some questions.", compatible_slots: [SlotType.Weapon] });
	const pants = new Item("Pants", 10, [[x,x,x],[x,_,x],[x,_,x]], { compatible_slots: [SlotType.Legs]});
	const sprite_test_shape = [
		[_,_,x,_,_],
		[_,x,x,x,_],
		[x,x,x,x,x],
		[_,x,x,x,_],
		[_,_,x,_,_]
	]
	const sprite_test = new Item("Sprite test", 1, sprite_test_shape);
	const hat = new Item("Funny hat", 1, [[x,x],[x,x]], { compatible_slots: [SlotType.HeadTop],
		description: "You feel like it's looking at you funny...",
		icon: "warlord-helmet"
	});
	const items = [candle, potion, axe, pants, sprite_test, hat];

	const equipment = new EquipmentSlotGroup();
	equipment.AddSlot(new EquipmentSlot("Head top", 240, 10, SlotType.HeadTop));
	equipment.AddSlot(new EquipmentSlot("Face", 240, 60, SlotType.Face));
	equipment.AddSlot(new EquipmentSlot("Torso", 175, 160, SlotType.Body));
	// console.debug(equipment);
	// equipment.PopulateContainer(equipment_container);
	//</editor-fold>

</script>