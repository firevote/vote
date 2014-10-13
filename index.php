<?php
// 应用程序目录，用的是魔术变量获取
define("APP_PATH",dirname(__FILE__));

// sp框架目录，SpeedPHP 目录所在位置
define("SP_PATH",dirname(__FILE__).'/SpeedPHP');

// 应用程序配置
$spConfig = array(
    'default_controller' => 'main', // 默认控制器名称
    'default_action'=>'index',      // 默认动作名称
    'url_controller'=>'c',          // 请求时控制器变量标识
    'url_action'=>'a',              // 请求时动作变量标识
    'dispatcher_error'=>'echo("路由错误，请检查控制器.");', //自定义路由错误
    'db'=> array(
        'host'=>'localhost',
        'login'=>'root',
        'password'=>'111111',
        'database'=>'test'
    ),

    // 视图配置
    'view' => array(
        'enabled' => TRUE, 		// 开启视图
        'config' =>array(
            'template_dir' => APP_PATH.'/template', 		// 模板目录
            'compile_dir' => APP_PATH.'/tmp',	 			// 编译目录
            'cache_dir' => APP_PATH.'/tmp',		 			// 缓存目录
            'left_delimiter' => '<{',  								// smarty左限定符
            'right_delimiter' => '}>' 								// smarty右限定符
        ),
        'debugging' => FALSE, 				// 是否开启视图调试功能，在部署模式下无法开启视图调试功能
        'engine_name' => 'Smarty', 			// 模板引擎的类名称，默认为Smarty
        'engine_path' => SP_PATH.'/Drivers/Smarty/Smarty.class.php', 	// 模板引擎主类路径
        'auto_display' => TRUE, 				// 是否使用自动输出模板功能
        'auto_display_sep' => '/', 				// 自动输出模板的拼装模式，/为按目录方式拼装，_为按下划线方式，以此类推
        'auto_display_suffix' => '.html', 	// 自动输出模板的后缀名
    )

);
require(SP_PATH."/SpeedPHP.php");
spRun();// SpeedPHP 3 新特性