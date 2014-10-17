/**
 * Created by W.J.Chang on 2014/10/17.
 */

define(function(require,exports,module){
    var commUtils = require('util/commonUtil').commUtils;

    function init() {
        bindEvent();

    }

    function bindEvent() {
        $('#update_cancel').bind('click',function(){
            clearInput();
        });

        $('#update_ok').bind('click',function() {
            var info_now_password = $('#info_now_password').val().trim();
            var info_new_password = $('#info_new_password').val().trim();
            var info_password_confirm = $('#info_password_confirm').val().trim();

            if(info_now_password == "" || info_new_password == "" || info_password_confirm =="") {
                alert('选项不能有空!');
                return;
            }

            if(info_new_password != info_password_confirm) {
                alert('两次密码不一致!');
                clearPasswordInput();
                return;
            }

            if(info_now_password == info_new_password) {
                alert('新密码不能与原始密码相同!');
                clearInput();
                return;
            }

            var postArgs = {
                'now_password':info_now_password,
                'new_password':info_new_password
            };

            commUtils.doAjaxPost('./index.php?c=work_mgr&a=change_password',postArgs).done(function(ret) {
                console.log(ret);
                var retObj = JSON.parse(ret);
                if(retObj['status'] == 0) {
                    window.location.href = './index.php?c=main&a=index';
                } else {
                    alert('修改失败,请重试。');
                }

            });

        });
    }

    function clearInput() {
        $('#info_now_password').val('');
        $('#info_new_password').val('');
        $('#info_password_confirm').val('');
    }

    function clearPasswordInput() {
        $('#info_new_password').val('');
        $('#info_password_confirm').val('');
    }


    exports.init = init;
});