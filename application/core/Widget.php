<?php
/**
 * Class Widget
 */
interface IWidget {
    public function init();
    public function run();
    public function actionBeforeRun();
    public function isShow();
    public function stop();
    public function __toString();
    public function getContent();
}

/**
 * Class Widget
 */
abstract class Widget implements IWidget{
    /**
     * @var CI_Loader|Base_Loader
     */
    public $load = null;

    /**
     * @var string
     */
    public $uniqueId = '';

    /**
     * @var CI_Config
     */
    protected $config = false;

    /**
     * @var AuthService
     */
    protected $auth = false;

    /**
     * @var IUser
     */
    protected $currentUser = false;

    /**
     * @var string
     */
    protected $lang = '';

    /**
     * @var bool|int
     */
    public $cityId = false;

    /**
     * @param Base_Loader|CI_Loader $loader
     */
    public function __construct(Base_Loader $loader)
    {
        $this->setUniqueId();

        $this->load = $loader;
        $this->load->setPathViews(array('views/' => true));

        $this->config = $this->load->getRootController()->config;
        $this->auth = $this->load->getAuth();

	    $this->currentUser = $this->auth->getUser();
    }

	/**
	 * @return bool
	 */
	public function init()
	{
		return true;
	}

    /**
     * @return LangManager
     */
    public function getLangManager()
    {
        return $this->load->getLangManager();
    }

    /**
     * @return Transliteration
     */
    public function getTransliterationManager()
    {
        return $this->load->getRootController()->getTransliteration();
    }

    /**
     * @return Native_session
     */
    public function getSession()
    {
        return $this->load->getRootController()->session;
    }

    /**
     * @return User
     */
    protected function getCurrentUser()
    {
        return $this->currentUser;
    }


    protected function setUniqueId()
    {
        $this->uniqueId = uniqid();
    }

    /**
     * @return string
     */
    public function getUniqId()
    {
        return $this->uniqueId;
    }

    /**
     * @return ClientManager
     */
    public function getClientManager()
    {
        return  $this->load->getRootController()->getClientManager();
    }

    /**
     * @param string $view
     * @param array $params
     * @param bool $isGetBuffer
     * @return string|void
     */
    public function render($view, $params = array(), $isGetBuffer = false)
    {
        return $this->load->view($view, $params, $isGetBuffer);
    }

	/**
	 * @return Base_Controller|CI_Controller
	 */
	protected function getCallController()
	{
		return $this->load->getController();
	}

    /**
     * @return string
     */
    public function __toString(){
        return __CLASS__;
    }

    /**
     * @return bool
     */
    public function actionBeforeRun()
    {
        return true;
    }

    /**
     * @return string
     */
    public function getContent()
    {
        return '';
    }

    /**
     * @return bool
     */
    public function isShow()
    {
        return true;
    }

    public function stop(){}
}