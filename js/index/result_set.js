/**
 * Created by W.J.Chang on 2014/10/17.
 */
define(function(require,exports,module){
    var commUtils = require('util/commonUtil').commUtils;
    var currentSearchRetObj = null;
    var currentSetRetItem = null;
    var currentRewardItems = null;

    function init() {
        bindEvent();
    }

    function bindEvent() {
        $('#btn_set_commit').bind('click',function() {
            var work_id=currentSetRetItem['work_id'];

            if($('#reward_item_option').val()=="-1") {
                commUtils.doAjaxPost('./index.php?c=work_mgr&a=delete_result_set',{'work_id':work_id}).done(function(ret) {
                    console.log(ret);
                    var retObj = JSON.parse(ret);
                    if(retObj['status'] == 0) {
                        $('#set_view_pop').hide();
                    }else {
                        alert('修改失败，请重试');
                    }
                });
            } else {
                var select_option_item = currentRewardItems[$('#reward_item_option').val()];
                var postArgs = {
                    'work_id':work_id,
                    'work_name':currentSetRetItem['name'],
                    'work_dep':currentSetRetItem['department'],
                    'work_pos':currentSetRetItem['position'],
                    'work_email':currentSetRetItem['email'],
                    'work_title':currentSetRetItem['work_title'],
                    'reward_item_id':select_option_item['item_id'],
                    'reward_item_name':select_option_item['item_name'],
                    'reward_item_index':select_option_item['item_index']
                };

                commUtils.doAjaxPost('./index.php?c=work_mgr&a=update_result_set',postArgs).done(function(ret)  {
                    var retObj = JSON.parse(ret);
                    if(retObj['status'] == 0) {
                        $('#set_view_pop').hide();
                    }else {
                        alert('修改失败，请重试');
                    }
                });

            }
        });

        $('#vote_set_tbody').on({
            'click':function() {
                var index = $(this).parent().children().first().val().trim();
                currentSetRetItem = currentSearchRetObj[index];

                $('#set_name_view').text(currentSearchRetObj[index]['name']);
                $('#set_dep_view').text(currentSearchRetObj[index]['department']);
                $('#set_pos_view').text(currentSearchRetObj[index]['position']);
                $('#set_mail_view').text(currentSearchRetObj[index]['email']);
                $('#set_title_view').text(currentSearchRetObj[index]['work_title']);
                $('#set_view_pop').show();

                commUtils.doAjaxPost('./index.php?c=work_mgr&a=get_reward_item',null).done(function (ret) {
                    console.log(ret);

                    var retObj = JSON.parse(ret);
                    if(retObj.length == 0) {
                        $('#reward_item_option').append('<option>没有可以设置的奖项</option>');

                    } else {
                        emptyOption();
                        currentRewardItems = retObj;
                        var dom = '<option value="-1">取消设定</option>';
                        for(var i=0;i<retObj.length;i++) {
                            dom += '<option value="'+i+'">'+retObj[i]['item_name']+'</option>';
                        }
                        $('#reward_item_option').append(dom);
                    }
                });
            }
        },'.view_set');

        $('#btn_set_close').bind('click',function() {
            $('#set_view_pop').hide();
        });

        $('#btn_email_search').bind('click',function() {
            var email = $('#email_input_is').val().trim();

            if(email == "") {
                alert('搜索内容不能为空!');
                return;
            }

            commUtils.doAjaxPost('./index.php?c=work_mgr&a=search_work_by_email',{'email':email}).done(function(ret){
                console.log(ret);

                var retObj = JSON.parse(ret);
                if(retObj.length == 0) {
                    alert('没有找到结果');
                }
                else {
                    currentSearchRetObj = retObj;
                    emptyTable();
                    for(var i=0;i<retObj.length;i++) {
                        $('#vote_set_tbody').append('<tr>'+
                        '<td> '+retObj[i]['name']+'</td>'+
                        '<td> '+retObj[i]['department']+' </td>'+
                        '<td> '+retObj[i]['email']+' </td>'+
                        '<td> '+retObj[i]['work_title']+'</td>'+
                        '<td><input type="hidden" value="'+i+'"/><a href="#" class="view-link view_set">设置</a></td> </tr>');
                    }
                    $('#vote_set_table').show();
                }

            });

        });
    }

    function emptyTable() {
        $('#vote_set_tbody').empty();
    }

    function emptyOption() {
        $('#reward_item_option').empty();
    }

    exports.init = init;
});