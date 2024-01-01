<?php

class ResultContainer {
	public bool $result;
	public string $msg;

	function __construct(bool $result, string $msg) {
		$this->result = $result;
		$this->msg = $msg;
	}
}