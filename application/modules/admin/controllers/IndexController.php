<?php

/**
 * Class IndexController
 */
class IndexController extends ModuleController
{
	public function actionIndex()
	{
		$view = $this->getViewModel();
		$view->testString = "<h1>Hello World from Module</h1>";

		// :WARNING: Template name must be unique in all system
		$this->render('indexAdmin', array('view' => $view));
	}

	public function actionTest()
	{
		$view = $this->getViewModel();
		$view->testString = "<h1>Test Action</h1>";

		// :WARNING: Template name must be unique in all system
		$this->render('testAdmin', array('view' => $view));
	}

	/**
	 * @return ViewModel
	 */
	protected function getViewModel()
	{
		return new ViewModel();
	}
}
