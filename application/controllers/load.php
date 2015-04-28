<?php
/**
 * Description content file
 *
 * @author Greg
 * @package 
 */

/**
 * Class test
 */
class load  extends Base_Controller
{
	public function index()
	{
        $this->getJsConfig()->set(['ext' => '.asc']);

		$this->render('load');
	}
}
