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

function validate_token(string $session_id, string $token, string $player): ResultContainer {
	require_once __DIR__ . "/classes_php/ResultContainer.php";
	$token = $token . "_" . $player . ".token";
	$session_path = __DIR__ . "/sessions/$session_id/tokens/";
	if (file_exists($session_path)) {
		$dir = opendir($session_path);
		while ($f = readdir($dir)) {
			if ($f === $token) {
				$data = file_get_contents($session_path . $f);
				$date = null;
				try {
					$now = new DateTime();
					$date = new DateTime($data);
					if ($now < $date)
						return new ResultContainer(true, "");
					else
						return new ResultContainer(false, "Token expired");
				} catch (Exception $e) {
				}
			}
		}
	}
	return new ResultContainer(false, "Invalid token/token not found");
}

function endswith($str, $substr) {
	return strpos($str, $substr) === strlen($str) - strlen($substr);
}

/**
 * @param array $post Accepts an associative array which may contain the fields
 * `session_length_years`, `session_length_months`, `session_length_days`, `session_length_hours`, `session_length_minutes`
 * @param string $default_interval An interval string such as `P1Y2DT1H5M` (1 year, 2 days, 1 hour, and 5 minutes)
 * @return string
 */
function construct_session_length(array $post, string $default_interval = "P1D"): string {
	$length_years = $_POST['session_length_years'] ?? 0;
	$length_months = $_POST['session_length_months'] ?? 0;
	$length_days = $_POST['session_length_days'] ?? 0;
	$length_hours = $_POSt['session_length_hours'] ?? 0;
	$length_minutes = $_POST['session_length_minutes'] ?? 0;

	if (($length_years + $length_months + $length_days + $length_hours + $length_minutes) === 0)
		return $default_interval;

	$time = (!empty($length_hours) && $length_hours > 0 ? $length_hours . "H" : "").
		(!empty($length_minutes) && $length_minutes > 0 ? $length_minutes . "M" : "");

	return "P" . (!empty($length_years) && $length_years > 0 ? $length_years . "Y" : "").
		(!empty($length_months) && $length_months > 0 ? $length_months . "M" : "").
		(!empty($length_days) && $length_days > 0 ? $length_days . "D" : "").
		(!empty($time) ? "T" . $time : "");
}