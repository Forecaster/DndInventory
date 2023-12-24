
class Drag_n_drop {
	SourceElement = null;
	DraggingElement = null;
	DragMode
	RotateEnabled
	OnDragEnd

	/**
	 * @param {{drag_mode:"drag"|"pick", rotate_enabled:boolean, on_drag_end:function }} options
	 */
	constructor(options = {}) {
		const drag_mode = options.drag_mode || "pick";
		if (drag_mode !== "drag" && drag_mode !== "pick")
			throw "InvalidDragMode";
		this.DragMode = drag_mode;
		this.RotateEnabled = options.rotate_enabled || true;
		this.OnDragEnd = options.on_drag_end || null;
	}

	#clone_events(source, target) {
		let cloned = []
		for (const prop in source) {
			if (prop.indexOf("on") === 0 && source[prop] !== null) {
				cloned.push(prop);
				target[prop] = source[prop];
			}
		}
		console.info(`Cloned ${cloned.length} event handlers.`, cloned);
	}

	#set_dragging_properties(element) {
		element.style.position = "fixed";
		element.style.pointerEvents = "none";
		element.style.opacity = "0.5";
		element.classList.add("dragging");
		Item.ScaleReset(element);
	}

	#reset_dragging_properties(element) {
		element.style.position = "absolute";
		element.style.pointerEvents = null;
		element.style.opacity = null;
		element.classList.remove("dragging");
	}

	on_drag_start(event) {
		this.dragging_element = event.currentTarget.cloneNode(true);
		this.dragging_element.style.position = "absolute";
		this.dragging_element.style.pointerEvents = "none";
		document.body.appendChild(this.dragging_element);
		let invisibleNode = event.currentTarget.cloneNode(true);
		invisibleNode.style.display = "none";
		event.dataTransfer.setDragImage(invisibleNode, 0, 0);
		if (event.currentTarget.hasAttribute("on_drag_copy") && event.currentTarget.getAttribute("on_drag_copy") === "false") {
			event.currentTarget.style.opacity = "0";
		}
	}

	on_drag(event) {
		// console.debug("on_drag", event);
		this.dragging_element.style.top = (event.clientY - (tile_height/2)) + "px";
		this.dragging_element.style.left = (event.clientX - (tile_width/2)) + "px";
	}

	on_drag_end(event) {
		console.debug("on_drag_end", event)
		try {
			document.body.removeChild(this.DraggingElement);
		} catch (e) {}
		event.currentTarget.style.opacity = null;
	}

	on_click(event, handler) {
		const target = event.currentTarget;
		console.debug("Object picked up!", target);
		if (target.hasAttribute("on_drag_copy") && target.getAttribute("on_drag_copy") === "true") {
			handler.SourceElement = null;
			handler.DraggingElement = target.cloneNode(true);
			this.#clone_events(target, handler.DraggingElement);
		} else {
			handler.SourceElement = target.parentElement;
			handler.DraggingElement = target;
		}
		handler.DraggingElement.removeAttribute("on_drag_copy");
		this.#set_dragging_properties(handler.DraggingElement);
		handler.DraggingElement.style.top = event.clientY - (tile_height/2) + "px";
		handler.DraggingElement.style.left = event.clientX - (tile_width/2) + "px";
		document.body.appendChild(handler.DraggingElement);
	}

	on_move(event, handler) {
		if (typeof handler.DraggingElement !== "undefined" && handler.DraggingElement !== null) {
			handler.DraggingElement.style.top = event.clientY - (tile_height/2) + "px";
			handler.DraggingElement.style.left = event.clientX - (tile_width/2) + "px";
		}
	}

	on_click_target(event, handler) {
		this.#reset_dragging_properties(handler.DraggingElement);
		handler.DraggingElement.onclick = function (event) {
			event.stopPropagation();
			console.debug("Call secondary on_click!");
			handler.on_click(event, handler);
		}
		handler.DraggingElement = null;
	}

	on_key_down(event, handler) {
		// console.debug(event);
		if (event.key.toLowerCase() === "r" && handler.DraggingElement !== null) {
			if (handler.DraggingElement.classList.contains("rotate90")) {
				handler.DraggingElement.classList.remove("rotate90");
				handler.DraggingElement.classList.add("rotate180");
			} else if (handler.DraggingElement.classList.contains("rotate180")) {
				handler.DraggingElement.classList.remove("rotate180");
				handler.DraggingElement.classList.add("rotate270");
			} else if (handler.DraggingElement.classList.contains("rotate270")) {
				handler.DraggingElement.classList.remove("rotate270")
			} else {
				handler.DraggingElement.classList.add("rotate90");
			}
		} else if (event.key.toLowerCase() === "escape" && handler.DraggingElement !== null) {
			if (handler.SourceElement !== null) {
				handler.SourceElement.appendChild(handler.DraggingElement);
				this.#reset_dragging_properties(handler.DraggingElement);
				handler.DraggingElement.style.top = "0";
				handler.DraggingElement.style.left = "0";
			} else
				document.body.removeChild(handler.DraggingElement);
			handler.DraggingElement = null;
			if (typeof this.OnDragEnd === "function")
				this.OnDragEnd(event, handler);
		}
	}

	/**
	 *
	 * @param {HTMLElement} element
	 * @param {{ [copy_element]:boolean, [custom_on_start]:function, [custom_on_drag]:function, [custom_on_end]:function }} [options]
	 * @returns {boolean}
	 */
	make_draggable(element, options = {}) {
		const copy_element = options.copy_element ?? false;
		const custom_on_start = options.custom_on_start ?? null;
		const custom_on_drag = options.custom_on_drag ?? null;
		const custom_on_end = options.custom_on_end ?? null;
		if (typeof element.tagName === "string") {
			// Common
			element.setAttribute("on_drag_copy", copy_element ? "true" : "false");
			// End Common

			const handler = this;

			if (this.RotateEnabled && document.onkeydown === null) {
				document.onkeydown = function(event) {
					handler.on_key_down(event, handler);
				}
			}

			if (this.DragMode === "pick") {
				element.onclick = function(event) {
					event.stopPropagation();
					if (handler.DraggingElement !== null)
						return;
					handler.on_click(event, handler);
					if (typeof custom_on_start === "function")
						custom_on_start(event, handler);
				}
				document.body.onmousemove = function(event) {
					event.stopPropagation();
					handler.on_move(event, handler);
					if (typeof custom_on_drag === "function")
						custom_on_drag(event, handler);
				}
			} else {
				element.setAttribute("draggable", "true");
				element.ondragstart = function(event) {
					event.stopPropagation();
					handler.on_drag_start(event)
					if (typeof custom_on_start === "function")
						custom_on_start(event, handler);
				};
				element.ondrag = function(event) {
					event.stopPropagation();
					handler.on_drag(event)
					if (typeof custom_on_drag === "function")
						custom_on_drag(event, handler);
				};
				element.ondragend = function(event) {
					event.stopPropagation();
					if (typeof handler.OnDragEnd === "function")
						handler.OnDragEnd(event, handler);
					handler.on_drag_end(event);
					if (typeof custom_on_end === "function")
						custom_on_end(event, handler);
				};
			}
			return true;
		}
		return false;
	}

	on_drag_over(event) {
		// console.debug("on_drag_over", event);
	}

	on_drop(event) {
		console.debug("on_drop", event);
		setTimeout(() => {
			this.dragging_element = null;
		}, 100);
	}

	/**
	 * @param {HTMLElement} element
	 * @param {{ [custom_on_drag_over]:function, [custom_on_drop]:function }} [options]
	 */
	make_droppable(element, options = {}) {
		const custom_on_drag_over = options.custom_on_drag_over ?? null;
		const custom_on_drop = options.custom_on_drop ?? null;
		if (typeof element.tagName === "string") {
			const handler = this;

			if (this.DragMode === "pick") {
				element.onclick = function(event) {
					if (handler.DraggingElement === null)
						return;
					event.stopPropagation();
					console.debug("droppable", handler.DraggingElement);
					if (typeof custom_on_drop === "function") {
						custom_on_drop(event, handler);
					}
					handler.on_click_target(event, handler);
					if (typeof handler.OnDragEnd === "function")
						handler.OnDragEnd(event, handler);
				}
			} else {
				element.ondragover = function (event) {
					event.stopPropagation();
					handler.on_drag_over(event);
					if (typeof custom_on_drag_over === "function")
						custom_on_drag_over(event, handler);
				}
				element.ondrop = function (event) {
					event.stopPropagation();
					handler.on_drop(event);
					if (typeof custom_on_drop === "function")
						custom_on_drop(event, handler);
				}
			}
		}
	}
}