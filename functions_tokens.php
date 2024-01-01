<?php

function get_token(): string {
	return hash('sha256', date("Y-m-d H:i:s"));
}

function validate_token(string $session_id, string $token, string $player): ResultContainer {
	require_once __DIR__ . "/classes_php/ResultContainer.php";
	$session_path = __DIR__ . "/sessions/$session_id/tokens/";
	if (file_exists($session_path)) {
		$dir = opendir($session_path);
		$token = $token . "_" . $player . ".token";
		while ($f = readdir($dir)) {
			if ($f === $token) {
				$data = file_get_contents($session_path . $f);
				$date = null;
				try {
					$now = new DateTime();
					$date = new DateTime($data);
					if ($now < $date) {
						touch($session_path . $f);
						return new ResultContainer(true, "");
					} else
						return new ResultContainer(false, "Token expired");
				} catch (Exception $e) {
				}
			}
		}
		return new ResultContainer(false, "Token not found: $token");
	}
	return new ResultContainer(false, "Session not found: $session_id");
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

/**
 * @return array Returns the token and expiry datetime as two strings in an array.
 */
function generate_token():array  {
	$token = get_token();
	$token_expires = new DateTime();
	try {
		$token_expires = $token_expires->add(new DateInterval(construct_session_length($_POST)));
		return [$token, $token_expires->format("Y-m-d H:i")];
	} catch (Exception $e) {
		return_error_as_json(ApiError::EXCEPTION, $e->getMessage());
	}
	return ["", ""];
}