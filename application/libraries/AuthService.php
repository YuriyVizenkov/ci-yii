<?php

/**
 * Class AuthService
 */
class AuthService 
{
	const NAME_SESSION_USER_ID = 'user_id';

	/**
	 * @var bool|CI_Session
	 */
	protected $session = false;

	/**
	 * @var bool|IUser
	 */
	protected static $user = false;

	/**
	 * @param CI_Session $session
	 */
	public function __construct(CI_Session $session)
	{
		$this->session = $session;
		if ($this->isAuth()) {
			self::$user = $this->getUser();
			self::$user->setAuthFlag();
		}

		$this->fillingDataUser();
	}

	protected function fillingDataUser()
	{

	}

	/**
	 * @param $user
	 */
	public function setUser(IUser $user)
	{
		if (isset($user->id)) {
			$this->session->set_userdata(array('user_id' => $user->id));
			$user->setAuthFlag();
		}

		self::$user = $user;
	}

	/**
	 * @return bool
	 */
	public function isAuth()
	{
		if ($this->getAuthId()) {
			return true;
		}

		return false;
	}

	/**
	 * @return string
	 */
	public function getAuthId()
	{
		return $this->session->userdata(self::NAME_SESSION_USER_ID);
	}

	/**
	 * @return bool|IUser
	 */
	public function getUser()
	{
		if (!self::$user && $this->isAuth()) {
			$userModel = new UserModel();
			self::$user = $userModel->findById($this->getAuthId());
			if (self::$user == false) {
				$this->setGuestUser();
			}
		}
		elseif (!self::$user && !$this->isAuth()){
			$this->setGuestUser();
		}

		return self::$user;
	}

	public function setGuestUser()
	{
		self::$user = new UserModel();
	}

	public function logout()
	{
		$this->session->set_userdata(array(self::NAME_SESSION_USER_ID => null));
        $this->session->unset_userdata(self::NAME_SESSION_USER_ID );
		$this->setGuestUser();
	}
}
 