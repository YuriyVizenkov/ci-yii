<?php
/**
 * Class ModuleController
 * @property Base_Loader $load
 * @property CI_Config $config
 */
abstract class ModuleController extends Base_Controller
{
    /**
     * @var null|CWebModule
     */
    protected $module = null;

    /**
     * @var string
     */
    protected $layout = 'index';

    /**
     * @var string
     */
    protected $assetsPath = '';

	/**
	 * @param array $views
	 */
	protected function setViews(array $views)
	{
		$this->load->setViews($views);
	}

    protected function setAssetsPath()
    {
        $this->assetsPath = MODULE_PATH . '/' . $this->getFolderNameFromModule(get_class($this->module)) . '/assets/';
    }

    /**
     * @param CWebModule $module
     */
    public function setModule(CWebModule $module)
    {
        $this->module = $module;
    }

    /**
     * @param string $view
     * @param array $data
     * @return string|void
     */
    public function render($view, $data = array())
    {
        $moduleFolder = $this->getFolderNameFromModule(get_class($this->module));
        $this->load->setViews(array(MODULE_PATH . '/' . $moduleFolder . '/views/' => true));

	    if ($this->layout) {
		    $content = parent::render($view, $data, true);
		    parent::render(
                $this->layout,
                array(
                    'content' => $content
                )
            );
	    }
	    else {
		    parent::render($view, $data);
	    }
    }

    public function init()
    {
	    $this->setViews(array(APPPATH . 'views/layouts/' => true));
        $this->setViews(array(MODULE_PATH . "/" . $this->getFolderNameFromModule(get_class($this->module)) . '/views/layouts/' => true));
        $this->setViews(array(MODULE_PATH . "/" . $this->getFolderNameFromModule(get_class($this->module)) . '/widgets/views/' => true));

        $this->beforeAction();
        $this->getModulesConfig();
    }

    public function beforeAction()
    {

    }

    /**
     * @param string $moduleName
     * @return string
     */
    public function getFolderNameFromModule($moduleName)
    {
        return strtolower(str_replace('Module', '', $moduleName));
    }

    /**
     * @param string $message
     */
    protected function renderError($message)
    {
        if ($this->isDebugMode()) {
            show_error($message);
        } else {
            log_message('error', $message);
        }
    }

    /**
     * @param string $url
     */
    public function redirect($url)
    {
        redirect($url);
    }

    /**
     * @param array $config
     * @return mixed
     */
    public function getModulePagination(array $config)
    {
        if (empty($config)) {
            log_message('error', 'No data to pagination module!');
        }

        $this->load->library('pagination');
        $this->pagination->initialize($config);
        return $this->pagination->create_links();
    }

    public function getModulesConfig()
    {
      $this->config->load('modules');
    }

	/**
	 * @param string $name
	 * @return string
	 */
	protected function getRequestParam($name)
	{
		return $this->input->post($name);
	}

	/**
	 * @return AuthService
	 */
	protected function getAuthService()
	{
		return $this->load->getAuth();
	}
}
