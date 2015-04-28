<?php
/**
 * Class ClientManager
 */
class ClientManager
{
    /**
     * @var CI_Config
     */
    protected $config = null;

    /**
     * @var string
     */
    protected $CDN_URL = '';

    /**
     * @var string
     */
    protected $APP_URL = '';

    /**
     * @var CI_Output
     */
    protected $output = null;

    /**
     * @var string
     */
    protected $assetsJS = '';

    /**
     * @var string
     */
    protected $assetsCSS = '';

    /**
     * @var array
     */
    protected static $packageJS = array();

    /**
     * @var array
     */
    protected static $packageCSS = array();

    /**
     * @var mixed[]
     */
    private static $modalWindow = array();

    /**
     * @var string
     */
    private static $title = '';

    /**
     * @var string
     */
    private static $description = '';

    /**
     * @var string
     */
    private static $metaKeywords = '';

	/**
	 * @var string
	 */
	private static $canonical = '';

    /**
     * @param CI_Config $config
     */
    public function __construct($config)
    {
        $this->config = $config;

        $this->output = & get_instance()->output;

        $this->CDN_URL = $this->config->item('CDN_URL');
        $this->APP_URL = $this->config->item('APP_URL');

        $this->assetsJS = ($this->APP_URL) ? $this->APP_URL . 'js/' : '/js/';
        $this->assetsCSS = ($this->APP_URL) ? $this->APP_URL . 'css/' : '/css/';
    }

    /**
     * @param string $newAssetsJS
     */
    public function setAssetsJS($newAssetsJS)
    {
        $this->assetsJS = $newAssetsJS;
    }

    /**
     * @return string
     */
    public function getCdnUrl()
    {
        return $this->CDN_URL;
    }

    /**
     * @return string
     */
    public function getAppUrl()
    {
        return $this->APP_URL;
    }

    /**
     * @param string $jQueryCore
     * @param array $params
     */
    public function registerCoreJQuery($jQueryCore, array $params = array())
    {
        echo $this->makeJSTag($jQueryCore, $params) . "\r\n";
    }

    /**
     * @param string $file
     * @param array $params
     */
    public function registerJS($file, $params = array())
    {
        if (!isset(self::$packageJS[$file])) {
            self::$packageJS[$file] = $this->makeJSTag($file, $params);
        }
    }

    /**
     * @param string $keyScript
     * @param string $body
     */
    public function registerScript($keyScript, $body)
    {
        self::$packageJS[$keyScript] = '<script type="text/javascript">' . $body . '</script>';
    }

    /**
     * @param string $file
     * @param array $params
     * @param bool $isIncludeAssets
     * @return string
     */
    private function makeJSTag($file, array $params = array(), $isIncludeAssets = true)
    {
        $assets = ($isIncludeAssets === true) ? $this->assetsJS : '';
        $tag = '<script type="text/javascript" src="' . $assets . $file . '.js" {params}></script>';

        $paramsString = '';
        foreach ($params as $attribute => $value) {
            $paramsString .= $attribute . '="' . $value . '"';
        }

        return str_replace('{params}', $paramsString, $tag);
    }

    /**
     * @param string $file
     * @param array $params
     */
    public function registerCSS($file, $params = array())
    {
        if (!isset(self::$packageCSS[$file])) {
            self::$packageCSS[$file] = $this->makeCSSTag($file, $params);
        }
    }

    /**
     * @param string $id
     * @param string $modalWindow html
     */
    public function registerModalWindow($id, $modalWindow)
    {
        if (!isset(self::$modalWindow[$id])) {
            self::$modalWindow[$id] = $modalWindow;
        }
    }

    /**
     *
     */
    public function includeJS()
    {
        $result = '';
        foreach (self::$packageJS as $file => $script) {
            $result .= $script;
        }

        echo $result;
    }

    /**
     *
     */
    public function includeCSS()
    {
        $result = '';
        foreach (self::$packageCSS as $file => $css) {
            $result .= $css;
        }

        echo $result;
    }

    /**
     *
     */
    public function renderModalWindows()
    {
        $modalWindows = '';
        foreach(self::$modalWindow as $window) {
            $modalWindows .= $window;
        }

        echo $modalWindows;
    }

    /**
     * @param string $file
     * @param array $params
     * @param bool $isIncludeAssets
     * @return mixed
     */
    private function makeCSSTag($file, array $params, $isIncludeAssets = true)
    {
        $assets = ($isIncludeAssets === true) ? $this->assetsCSS : '';
        $tag = '<link rel="stylesheet" type="text/css" href="' . $assets . $file . '.css" {params}>';

        $paramsString = '';
        foreach ($params as $attribute => $value) {
            $paramsString .= $attribute . '="' . $value . '"';
        }

        return str_replace('{params}', $paramsString, $tag);
    }

    /**
     * @param IMetadata $metadata
     */
    public function setMetadata(IMetadata $metadata)
    {
        $this->setTitle($metadata->getTitle());
        $this->setDescription($metadata->getDescription());
        $this->setMetaKeywords($metadata->getKeywords());
    }

    /**
     * @param string $title
     */
    public function setTitle($title)
    {
        self::$title = $title;
    }

    /**
     * @param string $description
     */
    public function setDescription($description)
    {
        self::$description = $description;
    }

    /**
     * @param string $metaKeywords
     */
    public function setMetaKeywords($metaKeywords)
    {
        self::$metaKeywords = $metaKeywords;
    }

	/**
	 * @param $request
	 */
	public function setCanonical($request)
	{
		self::$canonical = $request;
	}

    /**
     * @return string
     */
    public function getTitle()
    {
        return self::$title;
    }

    /**
     * @return string
     */
    public function getDescription()
    {
        return self::$description;
    }

    /**
     * @return string
     */
    public function getMetaKeywords()
    {
        return self::$metaKeywords;
    }

	/**
	 * @return string
	 */
	public function getCanonical()
	{
		if (self::$canonical !== '') {
			return '<link rel="canonical" href="' . self::$canonical . '"/>';
		}
		else {
			return '';
		}
	}
}
