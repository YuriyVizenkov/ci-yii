<?php
/**
 * Interface IUser
 */
interface IUser {
	/**
	 * @return void
	 */
	public function setAuthFlag();

	/**
	 * @return bool
	 */
	public function isGuest();

	/**
	 * @return bool
	 */
	public function isAdmin();

	/**
	 * @return string
	 */
	public function getName();

	/**
	 * @return int
	 */
	public function getId();

	/**
	 * @return string
	 */
	public function getStatus();

	/**
	 * @return string
	 */
	public function getGroup();

	/**
	 * @return string
	 */
	public function getLogin();

	/**
	 * @return string
	 */
	public function getPhone();

	/**
	 * @return string
	 */
	public function getEmail();
}
 