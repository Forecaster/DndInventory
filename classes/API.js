
class API {
	/**
	 * @param {string} endpoint An api endpoint such as `session_join`.
	 * @param {object} data An object containing the post data.
	 * @param {{ success:function(object), fail:function(object), error:function(object), method:"get"|"post" }} options
	 */
	static Call(endpoint, data, options = {}) {
		let success = options.success ?? ((payload) => { console.info(payload) });
		let fail = options.fail ?? ((payload) => { console.error(payload) });
		let error = options.error ?? ((payload) => { console.error(payload) });
		let method = options.method ?? "post";
		jQuery[method]("api/" + endpoint.toLowerCase() + ".php", data)
			.done((payload) => {
				payload = JSON.parse(payload);
				if (payload.result === 0 && success !== null)
					success(payload);
				else if (fail !== null)
					fail(payload);
			})
			.fail((payload) => {
				if (error !== null)
					error(payload);
			})

	}
}