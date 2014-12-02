/**
 * Created by W.J.Chang on 2014/10/23.
 */
define(function(require,exports,module) {
    var commUtils = require('util/commonUtil').commUtils;
    var currentPage = 1;
    var page_control = {
        work_list_panel:$('#vote_list_panel'),
        work_list_pager:$('#work_list_pager'),
        next_page:$('#more_page'),
        page_tip:$('#page_tip')
    };

    var login_panel = {
        main:$('#pop_login'),
        btn_close:$('#btn_close'),
        p_tip:$('#p_tip'),
        btn_login:$('#btn_login_ok'),
        btn_clear:$('#btn_login_clear'),
        input_account:$('#input_account'),
        input_password:$('#input_password')
    };

    var vote_pop_panel = {
        main:$('#pop_vote_succeed'),
        btn_close:$('#vote_pop_close')
    };

    var work_detail_panel = {
        main:$('#pop_work_detail'),
        pop_work_close:$('#pop_work_close'),
        work_detail_name:$('#work_detail_name'),
        work_detail_title:$('#work_detail_title'),
        work_detail_des:$('#work_detail_des'),
        work_count:$('#work_count')
    };

    function init() {
        loadPage();
        bind_event();
    }

    function bind_event() {
        work_detail_panel.pop_work_close.bind('click',function() {
            work_detail_panel.main.hide();
            enable_body_srcolling();
        });

        login_panel.btn_close.bind('click',function(){
            login_panel.main.hide();
            enable_body_srcolling();
        });

        login_panel.btn_clear.bind('click',function() {
            clear_input();
        });

        vote_pop_panel.btn_close.bind('click',function(){
            vote_pop_panel.main.hide();
            enable_body_srcolling();
        });

        page_control.next_page.bind('click',function() {
            currentPage ++;
            getPagedWorks(currentPage).done(function(ret) {
                //console.log(ret);
                var retObj = JSON.parse(ret);
                if(retObj['status'] == 0) {
                    var retObjData = retObj['data'];

                    for(var i=0;i<retObjData.length;i++) {
                        genItem(retObjData[i]['work_id'],retObjData[i]['detail_image_iid'],retObjData[i]['work_title'],retObjData[i]['name'],retObjData[i]['count'])
                    }

                    if(retObj['page']['last_page'] == currentPage) {
                        page_control.work_list_pager.hide();
                    }
                }

            });

        });

        login_panel.btn_login.bind('click',function() {
            var post_args = {
                'account':login_panel.input_account.val().trim(),
                'password':login_panel.input_password.val().trim()
            };
            commUtils.doAjaxPost('./index.php?c=vote_mgr&a=reg_login',post_args).done(function (ret) {
                //console.log(ret);
                var retObj = JSON.parse(ret);
                if(retObj['status'] == 0) {
                    clear_input();
                    login_panel.main.hide();
                    enable_body_srcolling();
                } else {
                    login_panel.p_tip.show();
                    login_panel.p_tip.text(retObj['msg']);
                    setTimeout(function(){
                        login_panel.p_tip.hide();
                        login_panel.p_tip.text('');
                    },3000);
                }

            });

        });

        page_control.work_list_panel.on({'click':function() {
            var _that = this;
            commUtils.doAjaxPost('./index.php?c=vote_mgr&a=check_session',null).done(function(ret) {
                //console.log(ret);
                var retObj = JSON.parse(ret);
                if(retObj['status'] == 1) {
                    login_panel.main.show();
                    disable_body_scrolling();
                }
                if(retObj['status'] == 0) {
                    var post_args = {'work_id':$(_that).parent().children().first().val()};
                    //console.log(post_args);
                    commUtils.doAjaxPost('./index.php?c=vote_mgr&a=do_vote',post_args).done(function(ret) {
                        //console.log(ret);
                        var retObj = JSON.parse(ret);
                        if(retObj['status'] == 0) {
                            var count = parseInt($(_that).parents().children('div').children('span').children().first().text().trim());
                            $(_that).parents().children('div').children('span').children().first().text(count+1);
                            vote_pop_panel.main.show();
                            disable_body_scrolling();
                            setTimeout(function(){
                                vote_pop_panel.main.hide();
                                enable_body_srcolling();
                            },3000);
                        } else {
                            alert(retObj['msg']);
                        }
                    });
                }
            });
        }},'.vote_to_him');

        page_control.work_list_panel.on({
            'click':function(){
                var _that = this;
                var post_args = {'work_id':$(_that).parent().children().first().val().trim()};
                work_detail_panel.main.show();
                disable_body_scrolling();
                commUtils.doAjaxPost('./index.php?c=vote_mgr&a=get_work_detail',post_args).done(function(ret) {
                    //console.log(ret);
                    var retObj = JSON.parse(ret);
                    if(retObj['status'] == 0) {
                        work_detail_panel.work_detail_name.text(retObj['data']['work_title']);
                        work_detail_panel.work_count.text(retObj['data']['work_count']);
                        var dom = '';
                        if(retObj['data']['work_zip_id'] != "") {
                            dom = '<a href="./index.php?c=work_mgr&a=download_file&res_id='+retObj['data']['work_zip_id']+'">下载</a>'
                        }
                        work_detail_panel.work_detail_des.html(retObj['data']['work_des'] + dom);
                    }
                });
            }
        },'.vote_see_detail');
    }

    function loadPage() {
        getPagedWorks(1).done(function(ret) {
            //console.log(ret);
            var retObj = JSON.parse(ret);
            if(retObj['status'] == 0) {
                var retObjData = retObj['data'];
                if(retObjData.length==0) {
                    page_control.page_tip.show();
                    page_control.page_tip.text('敬请期待...');
                    return;
                }

                for(var i=0;i<retObjData.length;i++) {
                    genItem(retObjData[i]['work_id'],retObjData[i]['detail_image_iid'],retObjData[i]['work_title'],retObjData[i]['name'],retObjData[i]['count'])
                }

                page_control.work_list_panel.show();
                if(retObj['page']['total_page'] != '1') {
                    page_control.work_list_pager.show();
                }
            }

            if(retObj['status'] == 2) {
                page_control.page_tip.show();
                page_control.page_tip.text('入围作品投票   12.2-12.7');
            }

            if(retObj['status'] == 3) {
                page_control.page_tip.show();
                page_control.page_tip.text('入围作品投票   12.2-12.7');
            }
        });
    }

    function getPagedWorks(query_page) {
        var def = $.Deferred();
        commUtils.doAjaxPost('./index.php?c=vote_mgr&a=get_work_list',{'query_page':query_page}).done(function(ret) {
            def.resolve(ret);
        });
        return def.promise();
    }

    function genItem(work_id,image_iid,work_title,work_name,count) {
        var dom = '<li>'+ '<input type="hidden" value="'+work_id+'"/>';
        if(image_iid == "") {
            dom+='<img class="vote_see_detail" src="./template/home/static/shortlisted/images/img01.png"/>';
        } else {
            dom+='<img class="vote_see_detail" src="./index.php?c=work_mgr&a=download_file&res_id='+image_iid+'"/>';
        }
        dom +=  '<div class="name clearfix">'+
                    '<h3 class="fl">'+work_title+'</h3>'+
                    '<span class="fr piao"><span>'+count+'</span><em>票</em></span>'+
                '</div>'+
                '<a href="javascript:;" class="btn01 vote_to_him">给他投票</a>'+
                '</li>';
        page_control.work_list_panel.children().first().append(dom);
    }

    function disable_body_scrolling() {
        $('body').css({overflow:'hidden'});
    }

    function enable_body_srcolling() {
        $('body').css({overflow:'scroll'});
    }

    function emptyItem() {
        page_control.work_list_panel.children().first().empty();
    }

    function clear_input() {
        login_panel.input_account.val('');
        login_panel.input_password.val('');
    }

    exports.init = init;
});