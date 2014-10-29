<?php

/**
 * Class Base_Log
 * Write log file package
 */
class Base_Log extends CI_Log
{
    const WRITE_FILE = 'WRITE';

    /**
     * @var array
     */
    protected static $messages = array();

    /**
     * @param string $level
     * @param string $msg
     * @param bool $php_error
     * @return bool
     */
    public function write_log($level = 'error', $msg, $php_error = false)
    {
        $level = strtoupper($level);
        if ($level !== self::WRITE_FILE && ($this->_enabled === false || !isset($this->_levels[$level])
            || ($this->_levels[$level] > $this->_threshold))) {
            return false;
        }

        self::$messages[] =
            $level . ' ' . (($level == 'INFO') ? ' -' : '-') . ' ' . date($this->_date_fmt) . ' --> ' . $msg . "\n";

        if ($level == self::WRITE_FILE) {
            $this->writeInFile();
        }

        return true;
    }

    /**
     * @param string $level
     * @param string $msg
     * @param bool $php_error
     * @return bool
     */
    public function sWriteLog($level = 'error', $msg, $php_error = false)
    {
        $level = strtoupper($level);
        self::$messages[] =
            $level . ' ' . (($level == 'INFO') ? ' -' : '-') . ' ' . date($this->_date_fmt) . ' --> ' . $msg . "\n";

        $this->writeInFile();

        return true;
    }

    /**
     *
     */
    public function writeInFile()
    {
        $filepath = $this->_log_path . 'log-' . date('Y-m-d') . '.php';
        if (!$fp = @fopen($filepath, FOPEN_WRITE_CREATE)) {
            return false;
        }

        $content = $this->assemblyContentLog();
        //var_dump($content);die;
        flock($fp, LOCK_EX);
        fwrite($fp, $content);
        flock($fp, LOCK_UN);
        fclose($fp);

        @chmod($filepath, FILE_WRITE_MODE);

        return true;
    }

    /**
     * @return string
     */
    protected function assemblyContentLog()
    {
        $content = '';
        foreach (self::$messages as $message) {
            $content .= $message;
        }

        self::$messages = array();

        return $content;
    }
}
