<?php

/**
 * Interface IProductsStorage
 */
interface IProductsStorage {
	/**
	 * Fetch a specific item from the session array
	 *
	 * @access	public
	 * @param	string|int $product
	 * @return	string|int
	 */
	public function getProduct($product);

	/**
	 * @access	public
	 * @param	int|string $productId
	 * @param	array $data
	 * @return	bool
	 */
	public function setProduct($productId, array $data);
	/**
	 * @return array
	 */
	public  function getProducts();

	/**
	 * @return bool
	 */
	public function clear();

	/**
	 * @param int|string $product
	 * @return bool
	 */
	public function hasProduct($product);

	/**
	 * @param string|int $product
	 * @return bool
	 */
	public function removeProduct($product);

	/**
	 * @param string $nameKeyStorage
	 * @return void
	 */
	public function setNameKeyStorage($nameKeyStorage);
}
 