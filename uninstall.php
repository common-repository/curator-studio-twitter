<?php
namespace cstwitter\uninstaller;

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	die('They died me');
}

spl_autoload_register(function($class){
	if( strpos($class, 'cstwitter\\') === 0 ){
		$class = str_replace('cstwitter\\', '', $class);
		$class = str_replace('\\', DIRECTORY_SEPARATOR, $class);
		$class = __DIR__.DIRECTORY_SEPARATOR.$class;
		require_once $class.'.php';
	}
});

require_once plugin_dir_path( __FILE__ ) . '/db/Database.php';

\cstwitter\db\Database::destroy(true);
