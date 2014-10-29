<?php

/**
 * Class FormException
 */
class FormException extends Exception
{
	/**
	 * @var array
	 */
	protected $messages = array();

	/**
	 * @param array     $messages
	 * @param int       $code
	 * @param Exception $previous
	 */
	public function __construct(array $messages, $code = 0, Exception $previous = null)
	{
		parent::__construct('', $code, $previous);
		$this->messages = $messages;
	}

	/**
	 * @return array
	 */
	public function getMessages()
	{
		return $this->messages;
	}
}
 