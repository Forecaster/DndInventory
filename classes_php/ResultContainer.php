<?php

class ResultContainer {
	public $result;
	public $msg;

	function __construct($result, $msg) {
		$this->result = $result;
		$this->msg = $msg;
	}
}