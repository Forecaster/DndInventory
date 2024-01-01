
class ClientConsole {
	/** @var {HTMLElement} */
	ConsoleElement
	/** @var {HTMLElement} */
	MessageContainer
	/** @var {HTMLInputElement} */
	InputElement
	/** @var {HTMLElement[]} */
	Messages

	/** @var {function(message:string)|null} */
	MessageHandler

	CustomOnInput
	/** @var {Object<string, { [description]:string, list:boolean, action:function(args:string[]) }>} */
	Commands

	/** @var {string[]} */
	CommandHistory
	CommandHistoryPointer = 0;

	/**
	 * @param {string|HTMLElement} element_or_selector
	 * @param {{ [on_input]:function, [commands]:Object<string, { [description]:string, list:boolean, action:function(args:string[]) }>, message_handler:function(message:string) }} [options]
	 */
	constructor(element_or_selector, options = {}) {
		if (typeof element_or_selector === "string")
			element_or_selector = document.querySelector(element_or_selector);
		this.ConsoleElement = element_or_selector;

		this.MessageHandler = options.message_handler ?? null;

		const client_console = this;
		this.CustomOnInput = options.on_input ?? null;
		this.Commands = options.commands ?? {};
		// <editor-fold desc="Define base commands">
		this.Commands.clear = {
			description: "Clears the console.",
			action: function(args) {
				client_console.Clear();
			}
		}
		this.Commands.help = {
			description: "Shows this command list.",
			action: function(args) {
				const commands = client_console.Commands;
				const lines = [];
				for (const command in commands) {
					const cmd = commands[command];
					const list = cmd.list ?? true;
					if (list) {
						lines.push(`/${command} - ${cmd.description}`);
					}
				}
				client_console.AddMessage(lines);
			}
		};
		this.AddAliasForCommand("help", "commands");
		this.AddAliasForCommand("help", "?");
		// </editor-fold>

		this.ConsoleElement.innerHTML = "";

		const container = document.createElement("div");
		container.className = "console_message_container";
		this.ConsoleElement.appendChild(container);
		this.MessageContainer = container;

		const input = document.createElement("input");
		input.className = "console_input";
		input.placeholder = "Console input - Type /help for a list of commands.";
		input.addEventListener("keydown", (event) => {
			if (event.key === "Enter" && input.value.length > 0) {
				if (typeof this.CustomOnInput === "function")
					this.CustomOnInput(input.value);
				else
					this.OnConsoleInput(input.value);
				input.value = "";
			} else if (event.key === "ArrowUp") {
				event.preventDefault();
				if (this.CommandHistory.length > 0) {
					input.value = this.CommandHistory[this.CommandHistoryPointer];
					this.CommandHistoryPointer = Math.min(this.CommandHistory.length - 1, this.CommandHistoryPointer + 1);
				}
			} else if (event.key === "ArrowDown") {
				event.preventDefault();
				if (this.CommandHistory.length > 0) {
					if (this.CommandHistoryPointer === 0)
						input.value = "";
					else {
						this.CommandHistoryPointer = Math.max(0, this.CommandHistoryPointer - 1);
						input.value = this.CommandHistory[this.CommandHistoryPointer];
					}
				}
			}
		})
		this.ConsoleElement.appendChild(input);
		this.InputElement = input;

		const spacer = document.createElement("div");
		this.ConsoleElement.appendChild(spacer);

		this.CommandHistory = [];
		const local_history = localStorage.getItem("client_console_history");
		if (local_history !== null) {
			this.CommandHistory = JSON.parse(local_history);
		}
	}

	Clear() {
		this.MessageContainer.innerHTML = "";
	}

	AddCommand(command, command_data) {
		this.Commands[command] = command_data;
	}

	AddAliasForCommand(command, alias) {
		if (this.Commands.hasOwnProperty(command)) {
			const cmd = this.Commands[command];
			this.Commands[alias] = {
				list: false,
				action: cmd.action
			};
		}
	}

	OnConsoleInput(console_input) {
		if (str_startswith(console_input, "/")) {
			const args = console_input.replace("/", "").split(" ");
			/** @var {string} */
			const command = args.shift();
			if (this.Commands.hasOwnProperty(command)) {
				if (this.CommandHistory.reverse()[0] !== console_input)
					this.CommandHistory.push(console_input);
				this.CommandHistory.reverse()
				this.CommandHistoryPointer = 0;
				localStorage.setItem("client_console_history", JSON.stringify(this.CommandHistory.slice(0, 100)));
				console.debug(this.CommandHistory);
				this.Commands[command].action(args);
			} else {
				this.AddMessage("Unknown command. Type /help or /? for help. Type /commands for a list of commands.");
			}
		} else {
			this.AddMessage(session.GetUserName() + ": " + console_input);
		}
		console.debug(console_input);
	}

	/**
	 * @param {string|[]} msg
	 * @returns {HTMLDivElement}
	 * @constructor
	 */
	AddMessage(msg) {
		if (!Array.isArray(msg))
			msg = [ msg ];
		const element = document.createElement("div");
		element.className = "console_message";
		element.innerHTML = msg.join("<br/>");
		this.MessageContainer.appendChild(element);
		this.MessageContainer.scroll(0, 1000000000);
		return element;
	}
}