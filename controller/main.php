<?php

//require_once APP_PATH.'/model/ado_fb_res.php';

class main extends spController
{
    function index()
    {
        $this->display('index/index.html');
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





    function test()
    {

    }
}