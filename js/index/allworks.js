/**
 * Created by W.J.Chang on 2014/10/13.
 */

define(function(require,exports,module){
    var commUtils = require('util/commonUtil').commUtils;
    var currentPager = null;

    function init() {
        loadPage();
        bindEvent();
    }

    function bindEvent() {
        $('#btn_view_close').bind('click',function() {
            $('#work_view_pop').hide();
        });

        $('.page_md_control').bind('click',function(){
            var btnText = $(this).children().text().trim();
            if(currentPager != null) {
                var query_page;
                if(btnText == '上一页') {
                    query_page = currentPager['prev_page'];
                }
                if(btnText == '下一页') {
                    query_page = currentPager['next_page'];
                }
                getPagedWorks(query_page).done(function(ret){
                    clearTable();
                    genTable(ret);
                });
            }
        });

        $('.page_ht_control').bind('click',function(){
            var btnText = $(this).children().text().trim();
            if(currentPager != null) {
                var query_page;
                if(btnText == '末页') {
                    query_page = currentPager['last_page'];
                }
                if(btnText == '首页') {
                    query_page = currentPager['first_page'];
                }
                getPagedWorks(query_page).done(function(ret){
                    clearTable();
                    genTable(ret);
                });
            }
        });

        $('#workview_tbody').on({
            'click':function() {
                var work_id = $(this).parent().children(0).val();
                var _that = this;
                if(confirm("确定删除?")) {

                    commUtils.doAjaxPost('./index.php?c=work_mgr&a=delete_work',{'work_id':work_id}).done(function(ret){
                        console.log(ret);
                        var retObj = JSON.parse(ret);
                        if(retObj['status']==0) {
                            $(_that).parent().parent().remove();
                        }
                    });
                }
            }
        },'.work_delete');

        $('#workview_tbody').on({
            'click':function() {
                var work_id = $(this).parent().children(0).val();
                commUtils.doAjaxPost('./index.php?c=work_mgr&a=view_work_detail',{'work_id':work_id}).done(function(ret) {
                    console.log(ret);
                    var retObj = JSON.parse(ret);
                    $('#work_name_view').text(retObj['work_name']);
                    $('#work_dep_view').text(retObj['work_department']);
                    $('#work_pos_view').text(retObj['work_position']);
                    $('#work_mail_view').text(retObj['work_email']);
                    $('#work_title_view').text(retObj['work_title']);
                    $('#work_des_view').text(retObj['work_des']);

                    $('#work_image_a').prop('href','./index.php?c=work_mgr&a=download_file&res_id='+retObj['work_image_id']);
                    $('#work_zip_a').prop('href','./index.php?c=work_mgr&a=download_file&res_id='+retObj['work_zip_id']);

                    $('#image_file_region').show();
                    if(retObj['work_image_id']=="") {
                        $('#image_file_region').hide();
                    }
                    $('#zip_file_region').show();
                    if(retObj['work_zip_id'] == "") {
                        $('#zip_file_region').hide();
                    }

                    $('#work_view_pop').show();
                } );
            }
        },'.work_view');
    }

    function loadPage() {
        getPagedWorks(1).done(function(ret) {
            console.log(ret);
            clearTable();
            genTable(ret);
        });
    }

    function setPageNum(cur,total) {
        $('#page_current').text(cur);
        $('#page_total').text(total);
    }

    function genTable(ret) {
        retObj = JSON.parse(ret);

        currentPager = retObj['page'];
        if(currentPager['total_count'] == 0) {
            $('#work_none').show();
            return;
        }

        $('#work_table').show();
        retObjData = retObj['data'];
        if(retObjData.length <= 0) {
            return;
        }
        for(var i=0;i<retObjData.length;i++) {
            $('#workview_tbody').append('<tr>'+
            '<td> '+retObjData[i]['count']+'</td>'+
            '<td> '+retObjData[i]['name']+'</td>'+
            '<td> '+retObjData[i]['department']+' </td>'+
            '<td> '+retObjData[i]['email']+' </td>'+
            '<td> '+retObjData[i]['work_title']+'</td>'+
            '<td><input type="hidden" value="'+retObjData[i]['work_id']+'"/><a href="#" class="view-link work_view">查看</a>&nbsp;&nbsp;&nbsp;<a href="#" class="view-link work_delete">删除</a></td> </tr>');
        }

        setPageNum(currentPager['current_page'],currentPager['total_page']);
        if(currentPager['total_page'] == 1) {
            $('#pagination').hide();
        }
    }

    function clearTable() {
        $('#workview_tbody').empty();
    }

    function getPagedWorks(query_page) {
        var def = $.Deferred();
        commUtils.doAjaxPost('./index.php?c=work_mgr&a=get_paged_works',{'query_page':query_page}).done(function(ret) {
            def.resolve(ret);
        });
        return def.promise();
    }

    exports.init = init;
});