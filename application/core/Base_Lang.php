<?php
/**
 * Class Base_Lang
 */
class Base_Lang extends CI_Lang
{
    /**
   	 * Fetch a single line of text from the language array
   	 *
   	 * @access	public
   	 * @param	string	$line	the language line
   	 * @return	string
   	 */
   	public function line($line = '')
   	{
   		$value = ($line == '' OR ! isset($this->language[$line])) ? $line : $this->language[$line];

   		return $value;
   	}
}
