/**
 * Created by W.J.Chang on 2014/10/17.
 */
define(function(require,exports,module) {
    var commUtils = require('util/commonUtil').commUtils;

    function init(){
        bindEvent();
    }

    function bindEvent() {
        $('#login_commit').bind('click',function() {

            var account = $('#account').val().trim();
            var password = $('#password').val().trim();

            if(account == "" && password == "") {
                alert('用户名或密码不能为空！');
            }

            var postArgs = {
                'account':account,
                'password':password
            };

            commUtils.doAjaxPost('./index.php?c=login&a=check',postArgs).done(function(ret) {
                console.log(ret);

                var retObj = JSON.parse(ret);
                if(retObj['status'] == 0) {
                    window.location.href = './index.php?c=main&a=admin&sid='+retObj['sid'];
                } else {
                    alert('用户名或密码不正确!');
                }
            });
        });
    }

    exports.init = init;

});