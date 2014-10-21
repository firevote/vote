/**
 * Created by W.J.Chang on 2014/10/17.
 */
define(function(require,exports,module){
    var commUtils = require('util/commonUtil').commUtils;

    function init() {
        initTable();
    }

    function initTable() {
        commUtils.doAjaxPost('./index.php?c=work_mgr&a=get_result_view',null).done(function(ret) {
            console.log(ret);

            var retObj = JSON.parse(ret);
            if(retObj.length == 0) {
                $('#result_view_none').show();
                return ;
            }

            for(var i=0;i<retObj.length;i++) {
                $('#result_view_tbody').append('<tr>'+
                '<td> '+retObj[i]['work_name']+'</td>'+
                '<td> '+retObj[i]['work_dep']+'</td>'+
                '<td> '+retObj[i]['work_email']+' </td>'+
                '<td> '+retObj[i]['work_title']+' </td>'+
                '<td> '+retObj[i]['reward_item_name']+'</td>'+
                '</tr>');
            }

            $('#result_view_table').show();
        });

    }

    exports.init = init;
});