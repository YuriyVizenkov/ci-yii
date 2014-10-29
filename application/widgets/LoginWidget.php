<?php
/**
 * Class LoginWidget
 */
class LoginWidget extends Widget
{
    public function init()
    {

    }

    public function run()
    {
        $this->render('login', array());
    }

	/**
	 * @return bool
	 */
	public function isShow()
	{
		return true;
	}
}
