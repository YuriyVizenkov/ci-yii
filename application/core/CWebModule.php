<?php
require_once(APPPATH . '/core/ModuleController.php');
/**
 * Class CWebModule
 */
abstract class CWebModule
{
    /**
     * @return array
     */
    public function getImport()
    {
        return array();
    }

	/**
	 * @return array
	 */
	public function getViewsPath()
	{
		return array();
	}

	/**
	 * @return bool
	 */
	public function init()
	{
		return true;
	}
}

