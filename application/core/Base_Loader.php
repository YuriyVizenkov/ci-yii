<?php

/**
 * Class Base_Loader
 */
class Base_Loader extends CI_Loader
{
    /**
     * @var CI_DB_driver
     */
    protected static $dbDriver = null;

    /**
     * List of paths to load widgets from
     *
     * @var array
     */
    protected $ci_widgets_path = array();

    /**
     * @var string
     */
    protected $basePathWidgets = '';

    /**
     * @var string
     */
    protected $basePathModel = '';

    /**
     * @var string
     */
    protected $basePathModule = '';

    /**
     * @var CI_Controller|Base_Controller
     */
    public $controller = null;

    /**
     * @var CI_Controller|Base_Controller
     */
    protected $rootController = null;

    /**
     * @var Base_Model|BSObject
     */
    protected static $models = array();

	/**
	 * @var array
	 */
	protected static $libraries = array();

    /**
     * @var LangManager
     */
    protected static $langManager = null;

    /**
     * @var array
     */
    protected static $modulesPaths = array();

	/**
	 * @var array
	 */
	protected static $corePaths = array();

	/**
	 * @var bool|CI_Config
	 */
	protected $config = false;

	/**
	 * @var AuthService
	 */
	protected static $auth = false;

	/**
	 * @param CI_Config $config
	 */
	public function __construct(CI_Config $config = null)
    {
        parent::__construct();

	    if ($config === null) {
		    $this->setConfig(app()->config);
	    }
	    else {
		    $this->setConfig($config);
	    }

        spl_autoload_register (array('Base_Loader', 'modelsAutoload'));
        spl_autoload_register (array('Base_Loader', 'librariesAutoload'));
        spl_autoload_register (array('Base_Loader', 'modulesAutoload'));
        spl_autoload_register (array('Base_Loader', 'coreAutoload'));

	    $this->setImportPaths();

	    $this->includeCoreLoadWidgets();

        $langManager = $this->getLangManager();
        $this->config->set_item('language', $langManager->getLang());
    }

	public function initAuthService()
	{
		$CI =& get_instance();
		if (self::$auth == false) {
			self::$auth = new AuthService($CI->session);
		}
	}

	/**
	 * @return AuthService
	 */
	public function getAuth()
	{
		return self::$auth;
	}

	/**
	 * @return bool|CI_Config
	 */
	public function getConfig()
	{
		return $this->config;
	}

	/**
	 * @param CI_Config $config
	 */
	public function setConfig(CI_Config $config)
	{
		$this->config = $config;
	}

	protected function setImportPaths()
	{
		$this->config->load('import');
		$import = $this->config->item('import');

		$this->setPathCoreClass($import['core']);

		$this->basePathModel = APPPATH . 'models/';
		$this->setPathModels($import['models']);

		$this->setPathLibraries($import['libraries']);

		$this->basePathWidgets = APPPATH . 'widgets/';
	    $this->ci_widgets_path[] = $this->basePathWidgets;

        $this->basePathModule = MODULE_PATH . '/';
		$this->_ci_view_paths[MODULE_PATH . '/photostream/widgets/views/'] = true;


		        /*$this->ci_widgets_path[] = APPPATH . 'widgets/filters_panel/';
        $this->ci_widgets_path[] = APPPATH . 'widgets/upload_image/';
        $this->ci_widgets_path[] = APPPATH . 'widgets/menu/';
        $this->ci_widgets_path[] = APPPATH . 'widgets/button/';
        $this->ci_widgets_path[] = APPPATH . 'widgets/comments/';
        $this->ci_widgets_path[] = APPPATH . 'widgets/complete_cities/';

        $this->ci_widgets_path[] = MODULE_PATH . '/photostream/widgets/';*/
	}

	public function initCoreFiles()
	{
		require_once(APPPATH.'core/Base_Session.php');
		ini_set('session.use_only_cookies', 1);
		$CI = app();
		$CI->session = new Base_Session();
		$CI->ci_is_loaded[] = 'session';
	}

	private function includeCoreLoadWidgets()
	{
		require_once(APPPATH . '/core/Widget.php');
		$import = $this->config->item('import');
		$this->setPathWidgets($import['widgets']['paths']);
	}

    public function createLangManager()
    {
        if (self::$langManager === null) {
            $config =& get_config();
            if (isset($config['lang_site']) && is_string($config['lang_site'])) {
                self::$langManager = new LangManager($_SERVER['HTTP_HOST'], $config['lang_site']);
            }
            else {
                self::$langManager = new LangManager($_SERVER['HTTP_HOST']);
            }
        }
    }

    /**
     * @return LangManager
     */
    public function getLangManager()
    {
        if (self::$langManager === null) {
            $this->createLangManager();
        }

        return self::$langManager;
    }

    /**
     * @param array $paths
     */
    public function setPathViews(array $paths = array())
    {
        foreach ($paths as $path => $isUse) {
            $this->_ci_view_paths[$this->basePathWidgets . $path] = $isUse;
        }
    }

    /**
     * @param array $paths
     */
    public function setViews(array $paths = array())
    {
        foreach ($paths as $path => $isUse) {
            $this->_ci_view_paths[$path] = $isUse;
        }
    }

    /**
     * @param array $paths
     */
    public function setPathWidgets(array $paths = array())
    {
        self::$models = array_merge(self::$models, $paths);
    }

	/**
	  * @param array $paths
	  */
	 public function setPathCoreClass(array $paths = array())
	 {
	     self::$corePaths = array_merge(self::$corePaths , $paths);
	 }

    /**
     * @param array $paths
     */
    public function setPathModels(array $paths = array())
    {
	    self::$models = $this->_ci_model_paths = array_merge($this->ci_widgets_path, $paths);
    }

	/**
	  * @param array $paths
	  */
	 public function setPathLibraries(array $paths = array())
	 {
	     self::$libraries = array_merge(self::$libraries, $paths);
	 }

    /**
     * @param array $paths
     */
    public function setPathsImportModule(array $paths)
    {
        self::$modulesPaths = array_merge(self::$modulesPaths, $paths);
    }

    /**
     * @param Base_Controller|CI_Controller $controller
     */
    public function setCurrentController(Base_Controller $controller)
    {
        if ($this->rootController === null) {
            $this->rootController = $controller;
        }
        $this->controller = $controller;
    }

    /**
     * @return CI_Controller|Base_Controller
     */
    public function getController()
    {
        return $this->controller;
    }

    /**
     * @return CI_Controller|Base_Controller
     */
    public function getRootController()
    {
        return $this->rootController ;
    }

	/**
	 * @param string $nameModule
	 * @return CWebModule
	 */
	public function getModule($nameModule)
    {
	    $currentModule = $this->setModule($nameModule);
        return $currentModule;
    }

	/**
	 * @param string $nameModule
	 * @return CWebModule
	 */
	public function setModule($nameModule)
	{
		$fullNameModule = $nameModule . 'Module';
        require_once(MODULE_PATH . '/' . strtolower($nameModule) . '/' . ucfirst($fullNameModule) . '.php');
	    /* @var $currentModule CWebModule */
        $currentModule = new $fullNameModule();
        $this->setPathsImportModule($currentModule->getImport());
	    $this->setPathViews($currentModule->getViewsPath());

		return $currentModule;
	}

    /**
     * @param string $nameClass name class widget
     * @param array $params
     * @return bool
     * @throws LogicException
     */
    public function widget($nameClass, $params = array())
    {
        try {
            if (empty($nameClass)) {
                throw new LogicException('Class must be defined for widget');
            }

            $this->includeWidget($nameClass);

            $widget = new $nameClass($this);
            if (!($widget instanceof IWidget)) {
                throw new LogicException('Widget `' . $nameClass . '` must be `IWidget` implement interface');
            }

            $this->initWidget($widget, $params);

            $widget->init();
            $widget->actionBeforeRun();
            if ($widget->isShow()) {
                $widget->run();
            }
            else {
                $widget->stop();
            }

            return $widget;
        }
        catch (LogicException $e) {
            ob_end_clean();
            show_error($e->getMessage());
        }
    }

    /**
     * @param string $nameClass
     * @param array $params
     * @return IWidget
     */
    public function beginWidget($nameClass, $params = array())
    {
        try {
            if (empty($nameClass)) {
                throw new LogicException('Class must be defined for widget');
            }

            $this->includeWidget($nameClass);

            $widget = new $nameClass($this);
            if (!($widget instanceof IWidget)) {
                throw new LogicException('Widget `' . $nameClass . '` must be `IWidget` implement interface');
            }

            $this->initWidget($widget, $params);

            $widget->init();
            if (!$widget->isShow()) {
                $widget->stop();
                return false;
            }
            
            ob_start();

            return $widget;
        }
        catch (LogicException $e) {
            ob_end_clean();
            show_error($e->getMessage());
        }
    }

    /**
     * @param IWidget $widget
     */
    public function endWidget(IWidget $widget)
    {
        $widget->actionBeforeRun();
        $result = ob_get_clean();
        echo $result;
    }

    /**
     * @param string $nameClass
     * @throws LogicException
     */
    protected function includeWidget($nameClass)
    {
        foreach ($this->ci_widgets_path as $path) {
            $pathToWidget = $path . $nameClass . '.php';
            if (file_exists($pathToWidget)) {
                require_once($pathToWidget);
                break;
            }
        }

        if (!class_exists($nameClass)) {
            throw new LogicException('Widget `' . $nameClass . '` not found');
        }
    }

    /**
     * @param IWidget|Widget $widget
     * @param array $params
     * @throws LogicException
     */
    protected function initWidget(IWidget $widget, $params)
    {
        $className = get_class($widget);
        foreach ($params as $property => $value) {
            if (!property_exists($className, $property)) {
                throw new LogicException('Property `' . $property . '` not defined in class widget `' . $className .
                                         '`');
            }

            $widget->$property = $value;
        }
    }

    /**
     * @param string $pathFile
     * @throws LogicException
     */
    public static function import($pathFile)
    {
        $absolutePathFile = APPPATH . $pathFile . '.php';
        if (!file_exists($absolutePathFile)) {
            throw new LogicException('Imported file `' . $absolutePathFile . ' not exists');
        }

        require_once($absolutePathFile);
    }

    /**
     * Load View
     *
     * This function is used to load a "view" file.  It has three parameters:
     *
     * 1. The name of the "view" file to be included.
     * 2. An associative array of data to be extracted for use in the view.
     * 3. TRUE/FALSE - whether to return the data or load it.  In
     * some cases it's advantageous to be able to return data so that
     * a developer can process it in some way.
     *
     * @param	string
     * @param	array
     * @param	bool
     * @return	void|string
     */
    public function view($view, $vars = array(), $return = FALSE)
    {
        return parent::view($view, $vars, $return);
    }

    /**
     * Model Loader
     *
     * This function lets users load and instantiate models.
     *
     * @param    string|array $model name of the class
     * @param    string $name for the model
     * @param    bool $db_conn connection
     * @return    bool
     */
    public function model($model, $name = '', $db_conn = false)
    {
        if (is_array($model)) {
            foreach ($model as $babe) {
                $this->model($babe);
            }

            return true;
        }

        if ($model == '') {
            return false;
        }

        $path = '';

        // Is the model in a sub-folder? If so, parse out the filename and path.
        if (($last_slash = strrpos($model, '/')) !== false) {
            // The path is in front of the last slash
            $path = substr($model, 0, $last_slash + 1);

            // And the model name behind it
            $model = substr($model, $last_slash + 1);
        }

        if ($name == '') {
            $name = $model;
        }

        if (in_array($name, $this->_ci_models, true)) {
            return;
        }

        $CI =& get_instance();
        if (isset($CI->$name)) {
            // show_error('The model name you are loading is the name of a resource that is already being used: ' . $name);
            return  true;
        }

        foreach ($this->_ci_model_paths as $mod_path) {
            if (file_exists($mod_path . 'models/' . $path . strtolower($model) . '.php')) {
                $model = strtolower($model);
            }
            elseif (!file_exists($mod_path . 'models/' . $path . $model . '.php')) {
                continue;
            }

            if ($db_conn !== false AND !class_exists('CI_DB')) {
                if ($db_conn === true) {
                    $db_conn = '';
                }

                $CI->load->database($db_conn, false, true);
            }

            if (!class_exists('CI_Model')) {
                load_class('Model', 'core');
            }

            require_once($mod_path . 'models/' . $path . $model . '.php');

            $model = ucfirst($model);

            $CI->$name = new $model();

            $this->_ci_models[] = $name;
            return;
        }

        // couldn't find the model
        show_error('Unable to locate the model you have specified: ' . $model);
    }

    /**
     * Database Loader
     *
     * @access public
     * @param string the DB credentials
     * @param bool whether to return the DB object
     * @param bool whether to enable active record (this allows us to override the config setting)
     * @return object
     */
    function database($params = '', $return = false, $active_record = null)
    {
        // Grab the super object
        $CI =& get_instance();

        // Do we even need to load the database class?
        if (class_exists('CI_DB') AND
            $return == false AND $active_record == null AND isset($CI->db) AND is_object($CI->db)
        ) {
            return false;
        }

        // Check for MY_DB in application/core
        $my_db = config_item('subclass_prefix') . 'DB';
        $my_db_file = APPPATH . 'core/' . $my_db . EXT;
        if (file_exists($my_db_file)) {
            require_once($my_db_file);
        }
        else {
            require_once(BASEPATH . 'database/DB' . EXT);
        }

        // Load the DB class
        if (self::$dbDriver === null) {
            self::$dbDriver = &DB($params, $active_record);

            // Check for a custom db driver
            $my_driver = config_item('subclass_prefix') . 'DB_' . self::$dbDriver->dbdriver . '_driver';
            $my_driver_file = APPPATH . 'core/' . $my_driver . EXT;

            if (file_exists($my_driver_file)) {
                require_once($my_driver_file);
                self::$dbDriver = new $my_driver(get_object_vars(self::$dbDriver));
            }
        }

        if ($return === true) {
            return self::$dbDriver;
        }

        // Initialize the db variable. Needed to prevent
        // reference errors with some configurations
        $CI->db = '';
        $CI->db = self::$dbDriver;
    }

    /**
     * @param string $nameModel
     */
    public static function modelsAutoload($nameModel)
    {
	    if (!empty($nameModel)) {
            foreach (self::$models as $modelPath) {
                $includeModel = $modelPath . strtolower($nameModel) . '.php';
                if (!file_exists($includeModel)) {
                    // Если файл назван по имени класса
                    $includeModel = $modelPath . $nameModel . '.php';
                }

                if (file_exists($includeModel)) {
                    require_once($includeModel);
                    break;
                }
            }
        }
    }

    /**
     * @param string $nameLibrary
     */
    public static function librariesAutoload($nameLibrary)
    {
        if (!empty($nameLibrary)) {
	        foreach (self::$libraries as $libraryPath) {
		        $includeLibrary = $libraryPath . $nameLibrary . '.php';
                if (!file_exists($includeLibrary)) {
                    // Если файл назван по имени класса
                    $includeLibrary = $libraryPath . $nameLibrary . '.php';
                }

                if (!file_exists($includeLibrary)) {
                    $includeLibrary = $libraryPath . strtolower($nameLibrary) . '.php';
                }

		        if (!file_exists($includeLibrary)) {
                    $includeLibrary = $libraryPath . strtolower($nameLibrary) . '.php';
                }

		        if (file_exists($includeLibrary)) {
                    require_once($includeLibrary);
                    break;
                }
            }
        }
    }

    /**
     * @param string $nameClass
     */
    public static function modulesAutoload($nameClass)
    {
        foreach (self::$modulesPaths as $modulePath) {
	        $includeModule = MODULE_PATH . '/' . $modulePath . $nameClass . '.php';
            if (file_exists($includeModule)) {
                require_once($includeModule);
                break;
            }
        }
    }

	/**
	  * @param string $nameClass
	  */
	 public static function coreAutoload($nameClass)
	 {
	     foreach (self::$corePaths as $path) {
	         $includeCoreClass = APPPATH . '/' . $path . $nameClass . '.php';
	         if (file_exists($includeCoreClass)) {
	             require_once($includeCoreClass);
	             break;
	         }
	     }
	 }
}
