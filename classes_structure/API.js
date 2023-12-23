
class API {
	/**
	 * @param {string} endpoint An api endpoint such as `session_join`.
	 * @param {{ data:object, success:function(object), fail:function(result:number, msg:string), error:function(object), method:"get"|"post" }} options `fail` is called when an api error occurs (`result` in response is not zero). `error` is called when a request error occurs.
	 */
	static Call(endpoint, options = {}) {
		const data = options.data ?? null;
		const success = options.success ?? ((payload) => { console.info(payload) });
		const fail = options.fail ?? ((result, msg) => { console.error(result, msg) });
		const error = options.error ?? ((payload) => { console.error(payload) });
		const method = options.method ?? "post";
		jQuery[method](`api/${endpoint.toLowerCase()}.php`, data)
			.done((payload) => {
				payload = JSON.parse(payload);
				if (payload.result === 0 && success !== null)
					success(payload);
				else if (fail !== null)
					fail(payload.result, payload.msg);
			})
			.fail((payload) => {
				if (error !== null)
					error(payload);
			})

	}
}