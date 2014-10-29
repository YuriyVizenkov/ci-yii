<?php

/**
 * Class Base_CIUnit_TestCase
 */
class Base_CIUnit_TestCase extends CIUnit_TestCase
{
	/**
	 * @var bool|Base_Loader
	 */
	public $load = false;

	/**
	 * @var bool
	 */
	protected $isTestMode = true;

	/**
	 * Constructor
	 *
	 * @param	string	$name
	 * @param	array	$data
	 * @param	string	$dataName
	 */
	public function __construct($name = NULL, array $data = array(), $dataName = '')
	{
		parent::__construct($name, $data, $dataName);
		$this->load = $this->CI->load;
	}
}
 