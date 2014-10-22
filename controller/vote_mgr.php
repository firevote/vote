<?php
/**
 * Created by PhpStorm.
 * User: W.J.Chang
 * Date: 2014/10/21
 * Time: 14:38
 */

error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED & ~E_STRICT & ~E_WARNING);
require_once INCLUDE_PATH.'common.php';

class vote_mgr extends spController{

    function do_vote() {
        $work_id = $_POST['work_id'];
        $votor = $_POST['votor'];
        $votor_password = $_POST['votor_password'];
        $retArr = array('status'=>-1,'msg'=>'unknown');

        if( !common::isSetAndNotNullAndNotEmpty($work_id) ||
            !common::isSetAndNotNullAndNotEmpty($votor)   ||
            !common::isSetAndNotNullAndNotEmpty($votor_password)) {
            $retArr['status']=1;
            $retArr['msg']='参数错误';
            echo json_encode($retArr);
            return;
        }

        if(!common::checkLDAP($votor,$votor_password)) {
            $retArr['status']=2;
            $retArr['msg']='用户身份错误';
            echo json_encode($retArr);
            return;
        }

        $ret = spClass('works')->findCount(array('work_id'=>$work_id));
        if($ret<=0) {
            $retArr['status']=3;
            $retArr['msg']='作品不存在';
            echo json_encode($retArr);
            return;
        }

        $ret = spClass('vote_votors')->findCount(array('work_id'=>$work_id,'votor'=>$votor));
        if($ret >0) {
            $retArr['status']=4;
            $retArr['msg']='不能重复投票';
            echo json_encode($retArr);
            return;
        }

        $ret = spClass('vote_votors')->findCount(array('votor'=>$votor));
        if($ret >5) {
            $retArr['status']=5;
            $retArr['msg']='超出票数限制';
            echo json_encode($retArr);
            return;
        }

        spClass('works')->incrField(array('work_id'=>$work_id),'count');
        $ret = spClass('vote_votors')->create(array('votor'=>$votor,'createtime'=>common::getCurrentTime(),'work_id'=>$work_id));

        if($ret) {
            $retArr['status']=0;
            $retArr['msg']='ok';
        } else {
            $retArr['status']=6;
            $retArr['msg']='数据库错误';
        }

        echo json_encode($retArr);
    }

    function do_usr_check() {
        $votor = $_POST['votor'];
        $votor_password = $_POST['votor_password'];
        $retArr = array('status'=>-1,'msg'=>'unknown');

        if( !common::isSetAndNotNullAndNotEmpty($votor)   ||
            !common::isSetAndNotNullAndNotEmpty($votor_password)) {
            $retArr['status']=1;
            $retArr['msg']='参数错误';
            echo json_encode($retArr);
            return;
        }

        if(!common::checkLDAP($votor,$votor_password)) {
            $retArr['status']=2;
            $retArr['msg']='用户身份错误';
        } else {
            $retArr['status']=0;
            $retArr['msg']='ok';
        }

        echo json_encode($retArr);
    }

    function get_word_detail() {

    }

    function get_work_list() {

    }

    function get_vote_result() {

    }

} 