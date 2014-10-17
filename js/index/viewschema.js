/**
 * Created by W.J.Chang on 2014/10/13.
 */
define(function(require,exports,module){
    var commUtils = require('util/commonUtil').commUtils;

    function init() {
        clearSchema();
        genContent();
    }

    function genContent() {
        commUtils.doAjaxPost('./index.php?c=work_mgr&a=view_schema',null).done(function(ret) {
            var retObjData = JSON.parse(ret);

            for(var i=0;i<retObjData.length;i++) {
                $('#schema_tbody').append('<tr>'+
                '<td> '+retObjData[i]['cpt_name']+'</td>'+
                '<td> '+retObjData[i]['cpt_start_time']+'</td>'+
                '<td> '+retObjData[i]['cpt_end_time']+' </td>'+
                '</tr>');
            }

        });
    }

    function clearSchema() {
        $('#schema_tbody').empty();
    }


    exports.init = init;
});