<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 * Class Base_Form_validation
 */
class Base_Form_validation extends CI_Form_validation
{

	/**
	 * @param array $config
	 */
	public function __construct($config = array())
     {
          parent::__construct($config);
     }

	     public function errors() {
        return $this->_error_array;
    }
	
    /**
     * Validates a date (yyyy/mm/dd/)
     *
     * @param type $date
     * @return boolean
     */
    public function valid_date($date) {
        if (!empty($date))
        {
            if (preg_match('/^([0-9]{4})-([0-9]{2})-([0-9]{2})$/', $date, $values))
            {
                if (checkdate($values[2], $values[3], $values[1]))    // Date really exists
                {
                    return TRUE;
                }
            }
        }
        return FALSE;
    }
}

/* End of file: MY_Form_validation.php */
/* Location: application/core/MY_Form_validation.php */