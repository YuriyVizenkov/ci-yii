<?php

/**
 * Class ProductWidget
 */
class ProductWidget extends Widget
{
	public function init()
	{

	}

	public function run()
	{
		$this->render('product/index', array());
	}

	/**
	* @return bool
	*/
	public function isShow()
	{
		return true;
	}
}
 