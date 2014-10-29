<?php if (!defined("BASEPATH")) exit("No direct script access allowed");
/**
 * Class Transliteration
 */
class Transliteration
{
    private $abc;

    /**
     * @param $transliterationRules
     */
    public function __construct($transliterationRules)
    {
          $this->abc = $transliterationRules;
    }

    /**
     * @param $str
     * @return string
     */
    public function transliterationUrl($str)
    {
        $str = mb_strtolower(trim($str), 'UTF-8');
        $transliterationStr = str_replace(array_keys($this->abc), array_values($this->abc), $str);
        $transliterationStr = preg_replace('~[^-a-z0-9]+~u', '-', $transliterationStr);
        return trim(preg_replace('/[-]{2,}/', '-', $transliterationStr), '-');
    }

    /**
     * @param string $str
     * @return string
     */
    public function transliterationWithoutMBLibrary($str)
    {
        $str = trim($str);
        $transliterationStr = str_replace(array_keys($this->abc), array_values($this->abc), $str);
        $transliterationStr = preg_replace('~[^-a-z0-9]+~u', '-', $transliterationStr);
        return strtolower(trim(preg_replace('/[-]{2,}/', '-', $transliterationStr), '-'));
    }
}