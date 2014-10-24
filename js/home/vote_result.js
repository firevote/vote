/**
 * Created by W.J.Chang on 2014/10/24.
 */
define(function(require,exports,module){
    var commUtils = require('util/commonUtil').commUtils;
    var page_control = {
        result_reg:$('#result_reg'),
        page_tip:$('#page_tip'),
        reward_reg_1:$('#reward_price_1'),
        reward_reg_2:$('#reward_price_2'),
        reward_reg_3:$('#reward_price_3')
    };

    function init() {
        getResult();
    }

    function getResult() {
        commUtils.doAjaxPost('./index.php?c=vote_mgr&a=get_vote_result',null).done(function(ret) {
            console.log(ret);
            var retObj = JSON.parse(ret);
            if(retObj['status'] == 0) {
                var retObjData = retObj['data'];
                if(retObjData.length == 0) {
                    page_control.page_tip.show();
                    page_control.page_tip.text('暂无结果...');
                }

                for(var i=0;i<retObjData.length;i++) {
                    if(retObjData[i]['reward_item_index'] == 1) {
                        page_control.result_reg.show();
                        page_control.reward_reg_1.show();
                        appendRewardItem(page_control.reward_reg_1,retObjData[i]['image_id'],retObjData[i]['work_title']);
                    }
                    if(retObjData[i]['reward_item_index'] == 2) {
                        page_control.result_reg.show();
                        page_control.reward_reg_2.show();
                        appendRewardItem(page_control.reward_reg_2,retObjData[i]['image_id'],retObjData[i]['work_title']);
                    }
                    if(retObjData[i]['reward_item_index'] > 2) {
                        page_control.result_reg.show();
                        page_control.reward_reg_3.show();
                        appendRewardItem(page_control.reward_reg_3,retObjData[i]['image_id'],retObjData[i]['work_title']);
                    }
                }
            }

            if(retObj['status'] == 2) {
                page_control.page_tip.show();
                page_control.page_tip.text('敬请期待...');
            }
        });
    }

    function appendRewardItem(dom,image_id,work_title) {
        dom.append('<p><img src="./index.php?c=work_mgr&a=download_file&res_id='+image_id+'" alt="创意之星-Apple iPhone6 plus"/></p>'+
        '<p class="pr-name"><span class="sp1">'+work_title+'</span></p>');
    }

    exports.init = init;
});