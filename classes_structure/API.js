
class API {
	/**
	 * @param {string} endpoint An api endpoint such as `session_join`.
	 * @param {{ [data]:{}, [success]:function(object), [fail]:function(result:number, options:{ msg:string, [data]:string }), [error]:function(object), [method]:"get"|"post" }} [options] `fail` is called when an api error occurs (`result` in response is not zero). `error` is called when a request error occurs.
	 */
	static Call(endpoint, options = {}) {
		const data = options.data ?? null;
		const success = options.success ?? ((payload) => { console.info(payload) });
		const fail = options.fail ?? ((result, options = {}) => { console.error(result, options) });
		const error = options.error ?? ((payload) => { console.error(payload) });
		const method = options.method ?? "post";
		// noinspection JSUnresolvedReference
		jQuery[method](`api/${endpoint.toLowerCase()}.php`, data)
			.done((payload) => {
				payload = JSON.parse(payload);
				if (payload.result === 0 && success !== null)
					success(payload);
				else if (fail !== null) {
					options = {
						msg: payload.msg,
						data: payload.data
					};
					fail(payload.result, options);
				}
			})
			.fail((payload) => {
				if (error !== null)
					error(payload);
			})
	}
}