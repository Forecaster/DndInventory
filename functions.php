<?php

/**
 * Builds an error array and kills the script returning a json encoded array
 *
 * @param int $error_id Attempts to look up error message in array stored in $errors either in `internal/errors.php`
 * or locally, if not defined or error not found returns error `9997 MySQL error (uses MySQL error message, only
 * applicable if $con exists)`, ´9998 Requested error not found in local error table´ or ´9999 Error table not
 * defined´
 * @param string $additional_data Optional additional data to return with the error
 * @param boolean $return_string
 *
 * @return null|string
 */
function return_error_as_json(int $error_id, string $additional_data = null, bool $return_string = false): string {
	global $con, $errors;
	$data = array();
	if (isset($errors)) {
		if (key_exists($error_id, $errors)) {
			$data["result"] = $error_id;
			if (isset($con) && mysqli_errno($con) !== 0) {
				$data["result"] = 9997;
				$data["msg"] = mysqli_error($con);
			} else
				$data["msg"] = $errors[$error_id];
		} else {
			$data["result"] = 9998;
			$data["msg"] = "Requested error not found in local error table";
		}
	} else {
		$data["result"] = 9999;
		$data["msg"] = "Error table not defined";
	}

	if (isset($additional_data))
		$data["data"] = $additional_data;
	if ($return_string)
		return json_encode($data);
	else
		die(json_encode($data));
}

/**
 * Builds the success response and kills the script, returning the response as json
 *
 * @param array $data
 * @param boolean $return_string
 *
 * @return null|string
 */
function return_success_as_json(array $data = null,  bool $return_string = false): string {
	$return = array("result" => 0, "msg" => "");
	if (isset($data)) {
		$return["data"] = $data;
	}
	if ($return_string)
		return json_encode($return);
	else
		die(json_encode($return));
}

function get_token(): string {
	return hash('sha256', date("Y-m-d H:i:s"));
}