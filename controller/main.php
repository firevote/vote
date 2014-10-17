<?php

error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED & ~E_STRICT & ~E_WARNING);

class main extends spController
{
    function index()
    {
        $this->display('login/login.html');
    }

    function admin() {

        session_start();
        if(!isset($_GET['sid']) || is_null($_GET['sid']) || $_SESSION[$_GET['sid']] != true) {
            $this->display('login/login.html');
            return;
        }

        $this->display('index/admin.html');
    }

    function allworks(){
        $this->display('index/allworks.html');
    }

    function addwork() {
        $this->display('index/addwork.html');
    }

    function viewschema() {
        $this->display('index/viewschema.html');
    }

    function setschema() {
        $this->display('index/setschema.html');
    }

    function update_account_view() {
        $this->display('index/update_account.html');
    }

    function result_set() {
        $this->display('index/result_set.html');
    }

    function result_view() {
        $this->display('index/result_view.html');
    }

    function reward_item() {
        $this->display('index/reward_item.html');
    }
}