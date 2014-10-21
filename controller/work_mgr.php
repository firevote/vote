<?php
/**
 * Created by PhpStorm.
 * User: W.J.Chang
 * Date: 2014/10/13
 * Time: 19:01
 */
error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED & ~E_STRICT & ~E_WARNING);

require_once INCLUDE_PATH.'common.php';

class work_mgr extends spController
{
    function get_result_view() {
        $retAll = $findRet = spClass('competition_result')->findSql('select * from competition_result order by reward_item_index ');
        echo json_encode($retAll);
    }

    function update_result_set() {

        $postArgs = array(
            'work_id'=>$_POST['work_id'],
            'work_name'=>$_POST['work_name'],
            'work_dep'=>$_POST['work_dep'],
            'work_pos'=>$_POST['work_pos'],
            'work_email'=>$_POST['work_email'],
            'work_title'=>$_POST['work_title'],

            'reward_item_id'=>$_POST['reward_item_id'],
            'reward_item_name'=>$_POST['reward_item_name'],
            'reward_item_index'=>$_POST['reward_item_index']
        );

        $retArr = array('status'=>-1);

        $findRet = spClass('competition_result')->find(array('work_id'=>$postArgs['work_id']));
        if($findRet) {
            $updateRet = spClass('competition_result')->update(array('work_id'=>$postArgs['work_id']),
                array('reward_item_id'=>$postArgs['reward_item_id'],'reward_item_name'=>$postArgs['reward_item_name'],'reward_item_index'=>$postArgs['reward_item_index']));
            if($updateRet) {
                $retArr['status'] = 0;
            }
        } else {
            $crateRet = spClass('competition_result')->create($postArgs);
            if($crateRet) {
                $retArr['status'] = 0;
            }
        }
        echo json_encode($retArr);
    }

    function delete_result_set() {
        $work_id = $_POST['work_id'];
        $retArr = array('status'=>-1);
        $ret = spClass('competition_result')->delete(array('work_id'=>$work_id));
        if($ret) {
            $retArr['status'] = 0;
        }
        echo json_encode($retArr);
    }

    function search_work_by_email() {
        $email = $_POST['email'];
        $retArr = spClass('works')->findSql("select * from works where email like '".$email."%'");
        echo json_encode($retArr);
    }

    function delete_reward_item() {
        $item_id = $_POST['item_id'];
        $retArr = array('status'=>-1);
        if($item_id != "") {
            $retInfo = spClass('reward_items')->delete(array('item_id'=>$item_id));
            if($retInfo) {
                $retArr['status'] = 0;
            } else {
                $retArr['status'] = -1;
            }
        } else {
            $retArr['status'] = -1;
        }
        echo json_encode($retArr);
    }


    function checkLDAP() {

        dump(common::checkLDAP('wjchang@iflytek.com','chang!2342'));
    }

    function update_reward_item() {
        $postArgs = $_POST['postArgs'];
        $retInt = true;
        for($i=0;$i<count($postArgs);$i++) {
            $itemObj=$postArgs[$i];
            if($itemObj['item_id']=="") {
                $itemObj['item_id']=common::guid();
                $retInt = $retInt && spClass('reward_items')->create($itemObj);
            }

            $retInt = $retInt && spClass('reward_items')->update(array('item_id'=>$itemObj['item_id']),
                    array('item_index'=>$itemObj['item_index'],'item_name'=>$itemObj['item_name'],'item_reward'=>$itemObj['item_reward']));
        }

        $retArr = array('status'=>-1);
        if($retInt) {
            $retArr['status']=0;
        }

        echo json_encode($retArr);
    }

    function get_reward_item() {
        $items = spClass('reward_items')->findSql('select * from reward_items order by item_index ');
        echo json_encode($items);
    }

    function check_email() {
        $email = $_POST['email'];

        $retArr = array('status'=>-1);
        $iret = spClass('works')->findCount(array('email'=>$email));
        if($iret == 0) {
            $retArr['status'] = 0;
        }

        echo json_encode($retArr);
    }

    function change_password() {
        $now_password = $_POST['now_password'];
        $new_password = $_POST['new_password'];
        $account_item = spClass('user_account')->find(array('account'=>'admin'));
        $retArr = array('status'=>-1);
        if($account_item['password'] != $now_password) {
            echo json_encode($retArr);
            return;
        }
        $updateRet = spClass('user_account')->update(array('account'=>'admin'),array('password'=>$new_password));

        if($updateRet) {
            $retArr['status'] = 0;
        } else {
            $retArr['status'] = -1;
        }
        echo json_encode($retArr);
    }

    function update_schema() {
        $argsArr = $_POST;

        $ret = true;

        for($i=1;$i<=count($argsArr)/2;$i++) {
            $competition_item = spClass('competition')->update(array('cpt_index'=>$i),array('cpt_start_time'=>$argsArr['s'.$i.'_start'],'cpt_end_time'=>$argsArr['s'.$i.'_end']));
            $ret = $ret && $competition_item;
        }

        if($ret) {
            $retArr = array('status'=>0);
            echo json_encode($retArr);
        }else {
            $retArr = array('status'=>-1);
            echo json_encode($retArr);
        }
    }

    function view_schema() {
        $schemas = spClass('competition')->findSql('select * from competition order by cpt_index ');
        echo json_encode($schemas);
    }

    function download_file() {
        $res_id = $_GET['res_id'];

        $res_item = spClass('res_upload')->find(array('res_id'=>$res_id));

        $file_dir = '';
        if($res_item['type'] == 'image') {
            $file_dir = UPLOAD_IMAGES_PATH;
        }
        if($res_item['type'] == 'zip') {
            $file_dir = UPLOAD_ZIPS_PATH;
        }

        common::download($file_dir,$res_item['res_fullname'],$res_item['res_originame']);
    }

    function view_work_detail() {
        $work_id = $_POST['work_id'];

        $work_item = spClass('works')->find(array('work_id'=>$work_id));
        $work_detail_item = spClass('work_details')->find(array('work_id'=>$work_id));

        $retArr = array(
            'work_name'=>$work_item['name'],
            'work_department'=>$work_item['department'],
            'work_position'=>$work_item['position'],
            'work_email'=>$work_item['email'],
            'work_title'=>$work_item['work_title'],
            'work_des'=>$work_detail_item['description'],
            'work_image_id'=>$work_detail_item['detail_image_iid'],
            'work_zip_id'=>$work_detail_item['detail_zip_iid']
        );

        echo json_encode($retArr);
    }

    function delete_work() {
        $work_id = $_POST['work_id'];

        $dret1 = spClass('works')->delete(array('work_id'=>$work_id));
        $dret2 = spClass('vote_votors')->delete(array('work_id'=>$work_id));

        $work_detail_item = spClass('work_details')->find(array('work_id'=>$work_id));

        $dret3 = true;
        if($work_detail_item['detail_image_iid'] != '') {
            $res_image_item = spClass('res_upload')->find(array('res_id'=>$work_detail_item['detail_image_iid']));
            unlink(UPLOAD_IMAGES_PATH.$res_image_item['res_fullname']);

            $dret3 = spClass('res_upload')->delete(array('res_id'=>$work_detail_item['detail_image_iid']));
        }

        $dret4 = true;
        if($work_detail_item['detail_zip_iid'] != '') {
            $res_zip_item = spClass('res_upload')->find(array('res_id'=>$work_detail_item['detail_zip_iid']));
            unlink(UPLOAD_ZIPS_PATH.$res_zip_item['res_fullname']);

            $dret4 = spClass('res_upload')->delete(array('res_id'=>$work_detail_item['detail_zip_iid']));
        }

        $dret5 = spClass('work_details')->delete(array('work_id'=>$work_id));

        if($dret1 && $dret2 && $dret3 && $dret4 && $dret5) {
            $ret = array('status'=>0);
            echo json_encode($ret);
        } else {
            $ret = array('status'=>-1);
            echo json_encode($ret);
        }

    }

    function get_paged_works() {
        $pageindex = $_POST['query_page'];
        $pagesize = 12;
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

        $retArr=array(
            'data'=>$ret,
            'page'=>$retPager
        );
        echo json_encode($retArr);
    }

    function addwork() {
        $postArgs = array(
            'work_name'=>$_POST['work_name'],
            'work_dep'=>$_POST['work_dep'],
            'work_pos'=>$_POST['work_pos'],
            'work_mail'=>$_POST['work_mail'],
            'work_des'=>$_POST['work_des'],
            'work_images_id'=>$_POST['work_images_id'],
            'work_zip_id'=>$_POST['work_zip_id'],
            'work_title'=>$_POST['work_title']
        );

        $work_id = common::guid();
        $work = array(
            'work_id'=>$work_id,
            'name'=>$postArgs['work_name'],
            'department'=>$postArgs['work_dep'],
            'position'=>$postArgs['work_pos'],
            'email'=>$postArgs['work_mail'],
            'work_title'=>$postArgs['work_title'],
            'createtime'=>common::getCurrentTime(),
            'count'=>0
        );

        $work_details = array(
            'work_id'=>$work_id,
            'description'=>$postArgs['work_des'],
            'detail_image_iid'=>$postArgs['work_images_id'],
            'detail_zip_iid'=>$postArgs['work_zip_id']
        );

        $m_works = spClass('works');
        $m_works->create($work);
        $m_work_details = spClass('work_details');
        $m_work_details->create($work_details);

        echo json_encode($_POST);
    }

    function upload_image() {
        $retinfo = array('status'=>-1,'info'=>'');
        if ($_FILES["work_images"]["error"] > 0)
        {
            $retinfo['info']=$_FILES["work_images"]["error"];
        }
        else
        {
            $retinfo['status']=0;
            if (file_exists(UPLOAD_IMAGES_PATH.$_FILES["work_images"]["name"]))
            {
                $retinfo['info']=$_FILES["work_images"]["name"]." already exists";
            }
            else
            {
                $guid = common::guid();
                $uFileName=$_FILES["work_images"]["name"];
                $uFileType = $_POST['filetype'];
                $uFileExt = common::get_extension($uFileName);

                move_uploaded_file($_FILES["work_images"]["tmp_name"],UPLOAD_IMAGES_PATH.$guid.'.'.$uFileExt);
                $retinfo['info'] = $guid;
                $res_upload_item = array('res_id'=>$guid,'type'=>$uFileType,'res_fullname'=>$guid.'.'.$uFileExt,'res_originame'=>$uFileName);
                $res_upload = spClass('res_upload');
                $res_upload->create($res_upload_item);
            }
        }
        echo json_encode($retinfo);
    }

    function upload_zip() {
        $retinfo = array('status'=>-1,'info'=>'');
        if ($_FILES["work_zip"]["error"] > 0)
        {
            $retinfo['info']=$_FILES["work_zip"]["error"];
        }
        else
        {
            $retinfo['status']=0;
            if (file_exists(UPLOAD_IMAGES_PATH.$_FILES["work_zip"]["name"]))
            {
                $retinfo['info']=$_FILES["work_zip"]["name"]." already exists";
            }
            else
            {
                $guid = common::guid();
                $uFileName=$_FILES["work_zip"]["name"];
                $uFileType = $_POST['filetype'];
                $uFileExt = common::get_extension($uFileName);

                move_uploaded_file($_FILES["work_zip"]["tmp_name"],UPLOAD_ZIPS_PATH.$guid.'.'.$uFileExt);
                $retinfo['info'] = $guid;
                $res_upload_item = array('res_id'=>$guid,'type'=>$uFileType,'res_fullname'=>$guid.'.'.$uFileExt,'res_originame'=>$uFileName);
                $res_upload = spClass('res_upload');
                $res_upload->create($res_upload_item);
            }
        }
        echo json_encode($retinfo);
    }

} 