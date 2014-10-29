<?php
if ( ! defined('BASEPATH')) exit('No direct script access allowed');

$config['import'] = array(
	'core' => array(
		'core/',
		'core/interfaces/',
		'core/throws/',
		'components/',
	),
	'modules' => array(),
	'libraries' => array(
		SYSDIR . '/libraries/',
		APPPATH . 'libraries/'
	),
	'models' => array(
		// adapted for model method in loader class for load model $loader->model('nameModel')
		APPPATH,
		APPPATH . 'models/',
		APPPATH . 'models/interfaces/'
	),
	'widgets' => array(
		'paths' => array(
			APPPATH . 'widgets/',
			APPPATH . 'widgets/menu/',
			APPPATH . 'widgets/complete_cities/'
		),
		'views' => array()
	)
);

