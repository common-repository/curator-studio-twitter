<?php
/**
 * @package Curator Studio - Twitter - Show tweets, mentions and more
 * @version 0.1.1
 */
/*
	Plugin Name: Curator Studio - Twitter
	Plugin URI: https://curatorstudio.io/twitter/
	Description: Select & curate content from Twitter.
	Author: Plugin Builders
	Version: 0.1.1
	Author URI: https://curatorstudio.io/
	Text Domain: curator-studio-twitter
*/

namespace cstwitter;

if( !defined( 'ABSPATH' ) ) die('They dead me.');

spl_autoload_register(function($class){
	if( strpos($class, 'cstwitter\\') === 0 ){
		$class = str_replace('cstwitter\\', '', $class);
		$class = str_replace('\\', DIRECTORY_SEPARATOR, $class);
		$class = __DIR__.DIRECTORY_SEPARATOR.$class;
		require_once $class.'.php';
	}
});

if( !function_exists('onActivation') ){
	function onActivation( $network_wide ){
		\cstwitter\db\Database::create( $network_wide );
	}
}

function setup(){
	\cstwitter\Entry::make();
}

function start(){
	register_activation_hook(__FILE__, '\cstwitter\onActivation');					
	add_action('plugins_loaded', '\cstwitter\setup');
}

start();
