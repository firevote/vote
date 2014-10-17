/**
 * Created by W.J.Chang on 14-6-24.
 */

define(function(require,exports,module) {

    function init() {
        bindEvent();
        //loadAllWorks();
        loadRewardItem();
    }

    function bindEvent() {
        $('.top_nav_item').bind('click',function() {
            $('.top_nav_item').removeClass('active');
            $(this).addClass('active');
        });

        $('.left_nav_item').bind('click',function() {
            $('.left_nav_item').removeClass('active');
            $(this).addClass('active');
        });

        $('#left_nav_allworks').bind('click',function() {
            loadAllWorks();
        });

        $('#left_nav_addwork').bind('click',function() {
            loadAddWork();
        });

        $('#left_nav_viewschema').bind('click',function() {
            loadSchema();
        });

        $('#left_nav_setschema').bind('click',function(){
            loadSchemaSetting();
        });

        $('#left_nav_account').bind('click',function() {
            loadUpdateAccountView();
        });

        $('#left_nav_reward_item').bind('click',function() {
            loadRewardItem();
        });

        $('#left_nav_result_view').bind('click',function() {
            loadResultView();
        });

        $('#left_nav_result_set').bind('click',function() {
            loadResultSet();
        });

        $('#top_nav_work').bind('click',function(){
            $('#left_nav_allworks').trigger('click');
        });

        $('#top_nav_schema').bind('click',function(){
            $('#left_nav_viewschema').trigger('click');
        });

        $('#top_nav_account').bind('click',function(){
            $('#left_nav_account').trigger('click');
        });

        $('#top_nav_result').bind('click',function(){
            $('#left_nav_result_view').trigger('click');
        });

    }

    function loadAllWorks(){
        $('#reg_content').load('./index.php?c=main&a=allworks');
    }

    function loadAddWork() {
        $('#reg_content').load('./index.php?c=main&a=addwork');
    }

    function loadSchema() {
        $('#reg_content').load('./index.php?c=main&a=viewschema');
    }

    function loadSchemaSetting() {
        $('#reg_content').load('./index.php?c=main&a=setschema');
    }

    function loadUpdateAccountView() {
        $('#reg_content').load('./index.php?c=main&a=update_account_view');
    }

    function loadRewardItem() {
        $('#reg_content').load('./index.php?c=main&a=reward_item');
    }

    function loadResultView() {
        $('#reg_content').load('./index.php?c=main&a=result_view');
    }

    function loadResultSet() {
        $('#reg_content').load('./index.php?c=main&a=result_set');
    }

    exports.init = init;
});
