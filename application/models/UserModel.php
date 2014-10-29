<?php

/**
 * Adapter for entity User Data
 * Class UserModel
 */
class UserModel extends Base_Model implements IUser
{
	/**
	 * @var string
	 */
	protected $tableName = "users";

	/**
	 * @var bool
	 */
	protected $isGuest = true;

	/**
	 * @return string
	 */
	public function getTableName()
	{
		return $this->tableName;
	}

	/**
	 * @param string $login
	 * @param string $password
	 * @return UserModel|null
	 */
	public function findByLoginAndPassword($login, $password)
	{
		$this->db->where(array('t.login' => $login, 't.password' => md5($password)));

		$user = $this->find();

		return $user;
	}

	/**
	 * @return bool
	 */
	public function isEmptyModel()
	{
		return (isset($this->id)) ? true : false;
	}

	public function setAuthFlag()
	{
		$this->isGuest = false;
	}

	/**
	 * @return bool
	 */
	public function isGuest()
	{
		return $this->isGuest;
	}
}
 