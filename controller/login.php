<?php
/**
 * Created by PhpStorm.
 * User: W.J.Chang
 * Date: 2014/10/17
 * Time: 10:08
 */

error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED & ~E_STRICT & ~E_WARNING);

require_once INCLUDE_PATH.'common.php';

class login extends spController
{
    function check()
    {

        $account = $_POST['account'];
        $password = $_POST['password'];


        $account_item = spClass('user_account')->find(array('account'=>'admin'));

        if($account_item['account']==$account && $account_item['password']==$password) {
            $gs = common::guid();

            session_start();
            $_SESSION[$gs]= true;

            $retArr = array('status'=>0,"sid"=>$gs);
            echo json_encode($retArr);
        } else {
            $retArr = array('status'=>-1);
            echo json_encode($retArr);
        }
    }
}