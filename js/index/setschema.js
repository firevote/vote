/**
 * Created by W.J.Chang on 2014/10/13.
 */
define(function(require,exports,module){
    var commUtils = require('util/commonUtil').commUtils;
    var schemaLength = 0;
    function init() {
        initPage();
        bindEvent();
    }

    function bindEvent() {
        $('#btn_schema_confirm').bind('click',function(ret) {
            var postArgs = {
                's1_start':'',
                's1_end':'',
                's2_start':'',
                's2_end':'',
                's3_start':'',
                's3_end':'',
                's4_start':'',
                's4_end':'',
                's5_start':'',
                's5_end':''
            };

            for(var i=0;i< schemaLength;i++) {
                var start = $('#dp_'+(i+1)+'_start').children(0).val();
                postArgs['s'+(i+1)+'_start'] = start;
                var end = $('#dp_'+(i+1)+'_end').children(0).val();
                postArgs['s'+(i+1)+'_end'] = end;
            }

            commUtils.doAjaxPost('./index.php?c=work_mgr&a=update_schema',postArgs).done(function(ret) {
                console.log(ret);
                $('#left_nav_viewschema').trigger('click');
            });
        });
    }

    function initPage() {
        $('#set_schema_panel').hide();
        commUtils.doAjaxPost('./index.php?c=work_mgr&a=view_schema',null).done(function(ret) {
            var retObjData = JSON.parse(ret);
            schemaLength = retObjData.length;
            for(var i=0;i<retObjData.length;i++) {
                $('#dp_'+(i+1)+'_start').prop('data-date',retObjData[i]['cpt_start_time']);
                $('#dp_'+(i+1)+'_start').children(0).val(retObjData[i]['cpt_start_time']);

                $('#dp_'+(i+1)+'_end').prop('data-date',retObjData[i]['cpt_end_time']);
                $('#dp_'+(i+1)+'_end').children(0).val(retObjData[i]['cpt_end_time']);

                $('#dp_'+(i+1)+'_start').datepicker();
                $('#dp_'+(i+1)+'_end').datepicker();

                $('#schema_name_' + (i+1)).text(retObjData[i]['cpt_name']);
                $('#set_schema_panel').show();
            }
        });
    }

    exports.init = init;
});