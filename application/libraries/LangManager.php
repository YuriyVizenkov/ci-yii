<?php
/**
 * Class Lang
 */
class LangManager
{
    const GERMAN_CODE = 'de';
    const RUSSIAN_CODE = 'ru';
    const ENGLISH_CODE = 'en';
    const BELARUS_CODE = 'by';
    const UKRAINE_CODE = 'ua';

    /**
     * @var string
     */
    private $region = '';

    /**
     * @param string $url
     * @param bool|string $lang
     */
    public function __construct($url, $lang = false)
    {
        if ($lang !== false) {
            $this->region = $lang;
        }
        else {
            $this->parseUrl($url);
        }
    }

    /**
     * @param string $url
     */
    private function parseUrl($url)
    {
        $breakUrl = parse_url($url);
        $path = $breakUrl['path'];

        $breakPath = explode('.', $path);
        $this->region = array_pop($breakPath);
    }

    /**
     * @return string
     */
    public function getLang()
    {
        return self::ENGLISH_CODE;
    }

    /**
     * @return string
     */
    public function getRegion()
    {
        return $this->getLang();
    }
}
