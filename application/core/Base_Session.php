<?php

/**
 * Class Base_SaveProduct
 */
class Base_Session extends CI_Session implements IProductsStorage
{
	/**
	 * @var string
	 */
	protected $keyStorage = 'cart';

	/**
	 * Session Constructor
	 *
	 * The constructor runs the session routines automatically
	 * whenever the class is instantiated.
	 */
	public function __construct($params = array())
	{
		parent::__construct($params);
	}

	/**
	 * @access	public
	 * @param	int|string $productId
	 * @param	array $data
	 * @return	bool
	 */
	public function setProduct($productId, array $data)
	{
		$products = $this->getProducts();
		$products[$productId] = $data;
		$this->saveProducts($products);
		return true;
	}

	/**
	 * @access	public
	 * @param	string|int $productId
	 * @return	mixed|null
	 */
	public function getProduct($productId)
	{
		$products = $this->getProducts();
		if (isset($products[$productId])) {
			return $products[$productId];
		}

		return null;
	}

	/**
	 * @param int|string $product
	 * @return bool
	 */
	public function hasProduct($product)
	{
		$products = $this->getProducts();
		if (isset($products[$product])) {
			return true;
		}

		return false;
	}

	/**
	 * @param string|int $product
	 * @return bool
	 */
	public function removeProduct($product)
	{
		if ($this->hasProduct($product)) {
			$products = $this->getProducts();
			unset($products[$product]);
			$this->saveProducts($products);
		}

		return true;
	}

	/**
	 * @return array
	 */
	public  function getProducts()
	{
		$products = unserialize($this->userdata($this->keyStorage));
		if ($products == false) {
			$products = array();
		}

		return $products;
	}

	/**
	 * @return bool
	 */
	public function clear()
	{
		$this->set_userdata($this->keyStorage, serialize(array()));
		return true;
	}

	/**
	 * @param array $products
	 */
	protected function saveProducts(array $products)
	{
		$this->set_userdata($this->keyStorage, serialize($products));
	}

	/**
	 * @param string $nameKeyStorage
	 * @return void
	 */
	public function setNameKeyStorage($nameKeyStorage)
	{
		$this->keyStorage = $nameKeyStorage;
	}
}
