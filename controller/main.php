<?php

error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED & ~E_STRICT & ~E_WARNING);

class main extends spController
{
    function index()
    {
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
}