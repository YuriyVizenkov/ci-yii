<?php
/**
 * Description content file
 *
 * @author Greg
 * @package 
 */
define('MODULE_PATH', APPPATH . 'modules');
$r = require_once  BASEPATH . '/../short_function.php';
require_once TESTSPATH. '/extension_unit_core/Base_CIUnit_TestCase.php';

/**
  * @param string $nameClass
  */
function testAutoload($nameClass)
 {
	 $configTestImport = array(
	 	'libs/'
	 );

     foreach ($configTestImport as $path) {
         $includeCoreClass = TESTSPATH . '/' . $path . $nameClass . '.php';
         if (file_exists($includeCoreClass)) {
             require_once($includeCoreClass);
             break;
         }
     }
 }

spl_autoload_register('testAutoload');