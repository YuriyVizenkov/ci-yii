<?php
/**
 * Description content file
 *
 * @author Greg
 * @package 
 */

/**
 * @return CI_Controller|Base_Controller
 */
function app()
{
	return get_instance();
}

/**
 * @param string $nameWidget
 * @param array $params
 */
function widget($nameWidget, array $params = array())
{
	/* @var $loader Base_Loader */
	$loader = app()->load;
	$loader->widget($nameWidget, $params);
}

/**
 * @return Base_Loader
 */
function getLoader()
{
	return app()->load;
}

/**
 * @return bool
 */
function isGuest()
{
	return getLoader()->getAuth()->isAuth() == false;
}

/**
 * @param string $message
 * @param string $type
 */
function l($message, $type = LogEnum::ERROR)
{
	app()->log($type, $message);
}