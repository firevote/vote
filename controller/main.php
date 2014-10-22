<?php

error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED & ~E_STRICT & ~E_WARNING);

class main extends spController
{
    //------------------  后台页面请求---------------------------------
    function index()
    {
        $this->display('home/index.html');
    }

    function login()
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

    // ------------投票页面请求--------------------------
    function vote_notice() {
        $this->display('home/entries.html');
    }

    function vote_result() {
        $this->display('home/results.html');
    }

    function work_vote() {
        $this->display('home/shortlisted.html');
    }

    function dep_intro() {
        $this->display('home/into.html');
    }


}