<?php
/**
 * 公共方法
 *
 * @name 公共方法
 * @package IFLYBookShop
 * @category model
 * @link /include/common.php
 * @author xlzhou2
 * @version 1.0
 * @created 2013-7-29 10:09:20
 *
 */
class common {
	/**
	 * 生成GUID
	 */
	public static function guid() {		
		if (function_exists ( 'com_create_guid' )) {
			$guid= com_create_guid ();
		} else {
			mt_srand ( ( double ) microtime () * 10000 ); // optional for php 4.2.0
			                                              // and up.
			$charid = strtoupper ( md5 ( uniqid ( rand (), true ) ) );
			$hyphen = chr ( 45 ); // "-"
			$uuid = chr ( 123 ) . 			// "{"
			substr ( $charid, 0, 8 ) . $hyphen . substr ( $charid, 8, 4 ) . $hyphen . substr ( $charid, 12, 4 ) . $hyphen . substr ( $charid, 16, 4 ) . $hyphen . substr ( $charid, 20, 12 ) . chr ( 125 ); // "}"
			$guid=$uuid;			
		}
		return substr($guid, 1,36);
	}

    public static function isSetAndNotNullAndNotEmpty($args) {
        if(!isset($args) || is_null($args) || empty($args)) {
            return false;
        }
        return true;
    }

    public static function checkLDAP($account,$password) {
        $LDAPHOST = 'LDAP://iflytek.com/';
        //$base_dn = 'OU=安徽中科大讯飞科技有限公司,DC=iflytek,DC=com';
        $ldap_conn = ldap_connect($LDAPHOST) or die('can not connect to LDAP server');
        $ret = false;
        @ldap_bind($ldap_conn,$account,$password);
        if(ldap_errno($ldap_conn) == 0) {
            $ret = true;
        }
        ldap_unbind($ldap_conn);
        return $ret;
    }


    public static function get_extension($file)
    {
        $info = pathinfo($file);
        return $info['extension'];
    }

    public static function download($file_dir,$file_name,$origi_name)
    {
        $file_dir = chop($file_dir);//去掉路径中多余的空格
        //得出要下载的文件的路径
        if($file_dir != '')
        {
            $file_path = $file_dir;
            if(substr($file_dir,strlen($file_dir)-1,strlen($file_dir)) != '/')
                $file_path .= '/';
            $file_path .= $file_name;
        }
        else
            $file_path = $file_name;

        //判断要下载的文件是否存在
        if(!file_exists($file_path))
        {
            echo '对不起,你要下载的文件不存在。';
            return false;
        }
        $file_size = filesize($file_path);

        header("Content-type: application/octet-stream");
        header("Accept-Ranges: bytes");
        header("Accept-Length: $file_size");
        header("Content-Length: $file_size");
        header("Content-Disposition: attachment; filename=".$origi_name);

        $fp = fopen($file_path,"r");
        $buffer_size = 1024;
        $cur_pos = 0;

        while(!feof($fp)&&$file_size-$cur_pos>$buffer_size)
        {
            $buffer = fread($fp,$buffer_size);
            echo $buffer;
            $cur_pos += $buffer_size;
        }

        $buffer = fread($fp,$file_size-$cur_pos);
        echo $buffer;
        fclose($fp);
        return true;
    }
	
	/**
	 * 生成返回信息数组
	 * @param int $errorCode
	 * @param string $errorInfo
	 * @param boolean $state
	 */
	static function errorArray($errorCode, $errorInfo, $state){
		$result ["errorCode"] = $errorCode;
		$result ["errorInfo"] = $errorInfo;
		$result ["result"] = array (
				"isSuccess" => $state
		);
		return $result;
	}
	
	/**
	 * 获取当前时间
	 * @return string
	 */
	public static function getCurrentTime() {
		return date("Y-m-d H:i:s");
	}
	
	/**
	 * 字符串字符过滤函数
	 * @param string $string 要过滤的字符串
	 * @return string
	 */
	public static function strFilter($string){
		return htmlspecialchars($string, ENT_QUOTES, 'UTF-8');
	}
	
	/**
	 * 数组字符串过滤函数
	 * @param string $array 要过滤的字符串数组
	 * @return string
	 */
	public static function arrayStrFilter($array){
		foreach ($array as $key => $value){
			if (is_array($value)) {
				$result[$key] = common::arrayStrFilter($value);
			}
			else $result[$key] = common::strFilter($value);
		}
		return $result;
	}
	
	/**  @creates a compressed zip file  将多个文件压缩成一个zip文件的函数
	 *   @$files 数组类型  实例array("1.jpg","2.jpg");
	 *   @destination  目标文件的路径  如"c:/androidyue.zip"
	 *   @$overwrite 是否为覆盖与目标文件相同的文件
	 */
	public static function create_zip($files = array(),$destination = '',$overwrite = false) {
		//if the zip file already exists and overwrite is false, return false
		//如果zip文件已经存在并且设置为不重写返回false
		if(file_exists($destination) && !$overwrite) { return false; }
		//vars
		$valid_files = array();
		//if files were passed in...
		//获取到真实有效的文件名
		if(is_array($files)) {
			//cycle through each file
			foreach($files as $file) {
				//make sure the file exists
				if(file_exists($file)) {
					$valid_files[] = $file;
				}
			}
		}
		
		//if we have good files...
		//如果存在真实有效的文件
		if(count($valid_files)) {
			//create the archive
			$zip = new ZipArchive();
			//打开文件       如果文件已经存在则覆盖，如果没有则创建
			if($zip->open($destination,$overwrite ? ZIPARCHIVE::OVERWRITE : ZIPARCHIVE::CREATE) !== true) {
				return false;
			}
			//add the files
			//向压缩文件中添加文件
			foreach($valid_files as $file) {
				$file_info_arr= pathinfo($file);
				$filename =$file_info_arr['basename'];
				//部署在linux下时取消掉下面这句注释
				if (OPERATING_SYSTEM == 'Linux') {
					$filename = iconv('utf-8', 'gbk', $filename);
				}
				$zip->addFile($file,$filename);
			}
			//debug
			//echo 'The zip archive contains ',$zip->numFiles,' files with a status of ',$zip->status;
			//close the zip -- done!
			//关闭文件
			$zip->close();
			//check to make sure the file exists
			//检测文件是否存在
			return file_exists($destination);
		}else{
			//如果没有真实有效的文件返回false
			return false;
		}
	}
	
	/**
	 * 比较两个日期大小
	 * @param date $first 2013-01-03
	 * @param date $last 1314-05-20
	 * @return number 1为大于、2为小于、 0为等于
	 */
	public static function compareDate($first,$last){
		$first = explode('-', $first);
		$last = explode('-', $last);

		if($first[0] == $last[0]){
			if($first[1] == $last[1]){
				if($first[2] == $last[2]){
					$var = 3;
				}else{
					$var = 2;
				}
			}else{
				$var = 1;
			}
		}else{
			$var = 0;
		}

		if($var == 0){
			if($first[0] > $last[0]){
				return 1;
			}else{
				return 2;
			}
		}else if($var == 1){
			if($first[1] > $last[1]){
				return 1;
			}else{
				return 2;
			}
		}else if($var == 2){
			if($first[2] > $last[2]){
				return 1;//大于
			}else{
				return 2;//小于
			}
		}else if($var == 3){
			return 0;//等于
		}
	}
}