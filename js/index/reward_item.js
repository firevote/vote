/**
 * Created by W.J.Chang on 2014/10/17.
 */
define(function(require,exports,module){
    var commUtils = require('util/commonUtil').commUtils;

    function init() {
        initPage();
        bindEvent();
    }

    function bindEvent() {
        $('#btn_item_add').bind('click',function(){
            appendRow('','','');
        });

        $('#reward_item_panel').on({'click':function() {
            var _that = this;
            var item_id = $(this).parent().children().first().val().trim();

            if(item_id == "") {
                $(this).parent().remove();
                return ;
            }

            commUtils.doAjaxPost('./index.php?c=work_mgr&a=delete_reward_item',{'item_id':item_id}).done(function(ret) {
                console.log(ret);
                var retObj = JSON.parse(ret);
                if(retObj['status'] == 0) {
                    $(_that).parent().remove();
                } else {
                    alert('删除失败，请重试')
                }
            });
        }},'.item_delete');

        $('#btn_item_update').bind('click',function() {
            var postArgs = [];
            var index = 1;
            $('.ri_index').each(function() {
                var itemObj = {
                    'item_index':index,
                    'item_id':$($(this).children()[0]).val().trim(),
                    'item_name':$($(this).children()[2]).val().trim(),
                    'item_reward':$($(this).children()[4]).val().trim()
                };
                postArgs.push(itemObj);
                index++;
            });

            for(var i=0;i<postArgs.length;i++) {
                if(postArgs[i]['item_name'] == "") {
                    alert('奖项不能有空! 请删除多余项');
                    return;
                }
            }

            commUtils.doAjaxPost('./index.php?c=work_mgr&a=update_reward_item',{'postArgs':postArgs}).done(function (ret) {
                console.log(ret);
                var retObj = JSON.parse(ret);
                if(retObj['status'] == 0) {
                    alert('修改成功.');
                } else {
                    alert('修改失败,请重试')
                }
            });

        });

    }

    function initPage() {
        commUtils.doAjaxPost('./index.php?c=work_mgr&a=get_reward_item',null).done(function(ret) {
            console.log(ret);
            var retObj = JSON.parse(ret);
            if(retObj.length == 0) {
                appendRow('','','');
                return;
            }

            for(var i=0;i<retObj.length;i++) {
                appendRow(retObj[i]['item_id'],retObj[i]['item_name'],retObj[i]['item_reward']);
            }
        });
    }

    function appendRow(item_id,item_name,item_reward) {
        $('#reward_item_panel').append('<div class="control-group ri_index">'+
        '<input type="hidden" value="'+item_id+'" />'+
        '<label class="control-label"><span class="star">*</span>奖项：</label>'+
        '<input type="text" class="input-large" value="'+item_name+'"/>'+
        '<label class="control-label">奖品：</label>'+
        '<input type="text" class="input-large" value="'+item_reward+'"/>'+
        '<button class="btn item_delete" style="position: relative;top: -2px;">删除</button>'+
        '</div>');
    }

    exports.init = init;
});