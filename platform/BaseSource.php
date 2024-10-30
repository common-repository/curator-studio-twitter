<?php
namespace cstwitter\platform;

if( !defined( 'ABSPATH' ) )
	die('They dead me.');

use cstwitter\utils\Utils;
use cstwitter\db\DB;

class BaseSource{
	function __construct(){
		$this->limit = 50;
		$this->enable_cache = Utils::$DEV;
	}
	
	function defaultState(){
		return [
			'pagination' => []
		];
	}
	
	function  validateCreds($state, $hash, $error_codes, $error_time_limit){
		$this->nonCredible = false;
		$transient = "cstudio_$hash";
		
		if(!Utils::$DEV && ($error = DB::get_transient($transient))){
			$this->nonCredible = $error;
			return false;
		}
		
		if( $state ){
			if( Utils::get($state, 'error' ) ){
				$error = $state['error'];
				
				if( in_array( Utils::get($error, 'code'), $error_codes ) ){
					if( Utils::get($error, 'creds') ){
						$creds = $error['creds'];
						if( 
							$hash === $creds['hash'] &&
							Utils::currentTime('timestamp') - $creds['at'] <= $error_time_limit
						){
							$this->nonCredible = (object)['error' => $error];
							DB::set_transient($transient, $this->nonCredible, $error_time_limit);
						}
					} else {
						$error['creds'] = [
							'hash' => $hash,
							'at' => Utils::currentTime('timestamp')
						];
						
						$this->nonCredible = (object)['error' => $error];
						DB::set_transient($transient, $this->nonCredible, $error_time_limit);
					}
				}
			}
		}
	}
		
	function nonLiveEdge($path){
		return strpos($path['edge'], '--shortcode') !== false || strpos($path['edge'], '--url-parameter') !== false;
	}
}
