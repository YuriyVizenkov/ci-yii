<?php

/**
 * @group Modules
 */

class SomeModuleTest extends Base_CIUnit_TestCase
{
	/**
	 * @var CWEbModule
	 */
	protected $module = false;

	public function setUp()
	{
		parent::tearDown();
		parent::setUp();

		$this->module = $this->load->getModule('Some');
	}

}
