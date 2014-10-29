<?php
/**
 * Class Base_Controller
 *
 * @property CI_Loader|Base_Loader $load
 * @property CI_Config             $config
 * @property CI_Migration          $migration
 * @property CI_Input              $input
 * @property CI_Output             $output
 * @property CI_DB_mysql_driver    $db
 * @property Base_Lang             $lang
 * @property JSON                  $json
 * @property CI_Session|Base_Session $session
 */
class Base_Controller extends CI_Controller
{
	/**
	 * @var ClientManager
	 */
	public $clientManager = null;

	/**
	 * @var Transliteration
	 */
	public static $trans = null;

	/**
	 * @var ClientManager
	 */
	protected static $instanceClientManager = null;

	/**
	 * @var bool
	 */
	protected static $initMigration = false;

	/**
	 * @var array
	 */
	protected $data = array();

	/**
	 * @var UserModel
	 */
	protected $user;

	/**
	 *
	 */
	public function __construct()
	{
		parent::__construct();

		$this->load->initCoreFiles();

		// TODO: Тестовый метод, при сдаче проекта убрать
		$this->createMigration();

		$this->load->setCurrentController($this);

		$this->createClientManager();

		if ($this->input->server('HTTP_X_REQUESTED_WITH') != 'XMLHttpRequest') {
			$this->output->enable_profiler($this->isDebugMode());
		} else {
			$this->output->enable_profiler(false);
		}

		$this->createTransliteration();
		}

	/**
	 *
	 */
	private function createMigration()
	{
		if (self::$initMigration === false) {
			// Делаем миграцию до последней версии
			if (!$this->migration->current()) {
				show_error($this->migration->error_string());
				die();
			}

			self::$initMigration = true;
		}
	}

	/**
	 *
	 */
	protected function createClientManager()
	{
		if (self::$instanceClientManager === null) {
			self::$instanceClientManager = new ClientManager($this->config);
		}

		if ($this->clientManager === null) {
			$this->clientManager = self::$instanceClientManager;
		}
	}

	protected function createTransliteration()
	{
		if (self::$trans === null) {
			$transliteration        = $this->config->item('transliteration');
			$currentTransliteration = $transliteration[$this->load->getLangManager()->getLang()];
			self::$trans            = new Transliteration($currentTransliteration);
		}
	}


	/**
	 * @return ClientManager
	 */
	public function getClientManager()
	{
		$this->createClientManager();
		return $this->clientManager;
	}

	/**
	 * @return Transliteration
	 */
	public function getTransliteration()
	{
		return self::$trans;
	}

	/**
	 * @return LangManager
	 */
	public function getLangManager()
	{
		return $this->load->getLangManager();
	}

	/**
	 * @param string $view
	 * @param array  $params
	 * @param bool   $isGetBuffer
	 * @return void|string
	 */
	protected function render($view, $params = array(), $isGetBuffer = false)
	{
		if (!isset($params['content'])) {
			$content = $this->load->view($view, $params, true);

			$params = array_merge($params, array(
				'content' => $content
			));
		}
		return $this->load->view($view, $params, $isGetBuffer);
	}

	/**
	 * @param mixed $response
	 */
	protected function renderJson($response)
	{
		echo json_encode($response);
	}

	/**
	 * @return bool
	 */
	protected function isDebugMode()
	{
		return $this->config->item('debug');
	}

	/**
	 * @return null|UserModel
	 */
	public function getCurrentUser()
	{
		return $this->load->getAuth()->getUser();
	}


	/**
	 * @param string      $body
	 * @param string      $subject
	 * @param string      $email
	 * @param bool|string $name
	 * @return bool
	 */
	public function sendEmail($body, $subject, $email, $name = false)
	{
		$done = send_email($body, $subject, $email, $name);
		return $done;
	}

	/**
	 * @param string $type
	 * @param string $message
	 */
	public function log($type, $message)
	{
		if (!$this->isDebugMode()) {
			show_error($message);
		} else {
			log_message($type, $message);
		}
	}

	protected function checkLoggedIn()
	{
		if(isGuest()) {
			throw new AuthException('Вы не вошли в систему');
		}
	}
}
