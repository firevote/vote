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
        $retArr = array('status'=>-1,'msg'=>'unknown');

        if( !common::isSetAndNotNullAndNotEmpty($work_id)) {
            $retArr['status']=1;
            $retArr['msg']='参数错误';
            echo json_encode($retArr);
            return;
        }

        if(common::isSetAndNotNullAndNotEmpty($_GET['PHPSESSID'])) {
            session_id($_GET['PHPSESSID']);
        }
        $sid = session_id();
        $currentSession = $_SESSION[$sid];
        if(!common::isSetAndNotNullAndNotEmpty($currentSession)) {
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

        $ret = spClass('vote_votors')->findCount(array('work_id'=>$work_id,'votor'=>$currentSession['votor']));
        if($ret >0) {
            $retArr['status']=4;
            $retArr['msg']='不能重复投票';
            echo json_encode($retArr);
            return;
        }

        $ret = spClass('vote_votors')->findCount(array('votor'=>$currentSession['votor']));
        if($ret >5) {
            $retArr['status']=5;
            $retArr['msg']='超出票数限制';
            echo json_encode($retArr);
            return;
        }

        spClass('works')->incrField(array('work_id'=>$work_id),'count');
        $ret = spClass('vote_votors')->create(array('votor'=>$currentSession['votor'],'createtime'=>common::getCurrentTime(),'work_id'=>$work_id));

        if($ret) {
            $retArr['status']=0;
            $retArr['msg']='ok';
        } else {
            $retArr['status']=6;
            $retArr['msg']='数据库错误';
        }

        echo json_encode($retArr);
    }

    function get_work_detail() {
        $work_id = $_POST['work_id'];
        $retArr = array('status'=>-1,'msg'=>'unknown');

        if(!common::isSetAndNotNullAndNotEmpty($work_id)) {
            $retArr['status'] = 1;
            $retArr['msg'] = '参数错误';
            echo json_encode($retArr);
            return;
        }

        $work_item = spClass('works')->find(array('work_id'=>$work_id));
        $work_detail_item = spClass('work_details')->find(array('work_id'=>$work_id));

        $ret_data = array(
            'work_name'=>'',
            //'work_department'=>$work_item['department'],
            //'work_position'=>$work_item['position'],
            //'work_email'=>$work_item['email'],
            'work_count'=>$work_item['count'],
            'work_title'=>$work_item['work_title'],
            'work_des'=>$work_detail_item['description'],
            'work_image_id'=>$work_detail_item['detail_image_iid'],
            'work_zip_id'=>$work_detail_item['detail_zip_iid']
        );

        $retArr['status'] = 0;
        $retArr['msg'] = 'ok';
        $retArr['data'] = $ret_data;

        echo json_encode($retArr);
    }

    // todo
    function get_work_list() {
        $pageindex = $_POST['query_page'];
        $pagesize = 12;
        $retArr = array(
            'status'=>-1,
            'msg'=>'unknown'
        );

        if(!common::isSetAndNotNullAndNotEmpty($pageindex)) {
            $retArr['status']=1;
            $retArr['msg']='参数错误';
            echo json_encode($retArr);
            return;
        }

        $today = common::getCurrentTime();
        //$today = '2014-11-28';
        $schme_item = spClass('competition')->find(array('cpt_index'=>3));
        $condition1 = common::compareDate($today,$schme_item['cpt_start_time']) == 2;
        if($condition1) {
            $retArr['status']=2;
            $retArr['msg']='没到投票时间';
            echo json_encode($retArr);
            return;
        }
        $condition2 = common::compareDate($today,$schme_item['cpt_end_time']) == 1;
        if($condition2) {
            $retArr['status']=3;
            $retArr['msg']='已过投票时间';
            echo json_encode($retArr);
            return;
        }

        $works = spClass('works');
        $ret = $works->spPager($pageindex,$pagesize)->findSql('select * from works order by count DESC ');
        $retPager = $works->spPager()->getPager();

        if($retPager==NULL && $pageindex > 1) {
            $ret = array();
        }
        else if($retPager==NULL){
            $retPager['current_page']=1;
            $retPager['first_page']=1;
            $retPager['prev_page']=1;
            $retPager['next_page']=1;
            $retPager['last_page']=1;
            $retPager['total_count']=count($ret);
            $retPager['total_page']=1;
            $retPager['page_size']=$pagesize;
            $retPager['all_pages']=array(1);
        }

        for($i = 0; $i < count($ret);$i++) {
            $work_detail_item = spClass('work_details')->find(array('work_id'=>$ret[$i]['work_id']));
            $ret[$i]['detail_image_iid']=$work_detail_item['detail_image_iid'];
            $ret[$i]['name']='';
            $ret[$i]['department']='';
            $ret[$i]['position']='';
            $ret[$i]['email']='';
        }


        $retArr=array(
            'status'=>0,
            'msg'=>'ok',
            'data'=>$ret,
            'page'=>$retPager
        );

        echo json_encode($retArr);
    }

    function check_session() {
        if(common::isSetAndNotNullAndNotEmpty($_GET['PHPSESSID'])) {
            session_id($_GET['PHPSESSID']);
        }
        $sid = session_id();
        $currentSession = $_SESSION[$sid];
        $retArr = array('status'=>-1);
        if(!common::isSetAndNotNullAndNotEmpty($currentSession)) {
            $retArr['status'] = 1;
        } else {
            $retArr['status'] = 0;
        }

        echo json_encode($retArr);
    }

    function reg_login() {
        $account = $_POST['account'];
        $password = $_POST['password'];

        $retArr=array('status'=>-1,'msg'=>'unknown');
        if(!common::isSetAndNotNullAndNotEmpty($account) || !common::isSetAndNotNullAndNotEmpty($password)) {
            $retArr['status'] = 1;
            $retArr['msg'] = '参数错误';
            echo json_encode($retArr);
            return ;
        }
        $account=$account.'@iflytek.com';
        if(common::checkLDAP($account,$password)) {
            $retArr['status'] = 0;
            $retArr['msg'] = 'ok';

            if(common::isSetAndNotNullAndNotEmpty($_GET['PHPSESSID'])) {
                session_id($_GET['PHPSESSID']);
            }
            session_start();
            $sid = session_id();
            $current = array('checked'=>true,'votor'=>$account);
            $_SESSION[$sid]=$current;
        } else {
            $retArr['status'] = 2;
            $retArr['msg'] = '用户名或密码错误';
        }

        echo json_encode($retArr);
    }

    function get_vote_result() {
        $retArr = array(
            'status'=>-1,
            'msg'=>'unknown'
        );

//        $today = common::getCurrentTime();
        $today = '2014-12-1';
        $schme_item = spClass('competition')->find(array('cpt_index'=>5));
        $condition1 = common::compareDate($today,$schme_item['cpt_start_time']) == 2;
        if($condition1) {
            $retArr['status']=2;
            $retArr['msg']='没到揭晓时间';
            echo json_encode($retArr);
            return;
        }

        $retAll = $findRet = spClass('competition_result')->findSql('select * from competition_result order by reward_item_index ');

        if(count($retAll)==0) {
            $retArr = array(
                'status'=>0,
                'msg'=>'ok',
                'data'=>$retAll
            );
            echo json_encode(($retArr));
            return;
        }


        for($i=0;$i<count($retAll);$i++) {
            $detail_item = spClass('work_details')->find(array('work_id'=>$retAll[$i]['work_id']));
            $retAll[$i]['image_id']=$detail_item['detail_image_iid'];
            $retAll[$i]['work_name']='';
            $retAll[$i]['work_dep']='';
            $retAll[$i]['work_pos']='';
            $retAll[$i]['work_email']='';
        }

        $retArr = array(
            'status'=>0,
            'msg'=>'ok',
            'data'=>$retAll
        );

        echo json_encode($retArr);
    }
}