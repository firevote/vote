/**
 * Created by W.J.Chang on 14-6-24.
 */

define(function(require,exports,module) {

    function init() {
        bindEvent();
        //loadAllWorks();
        loadAddWork();
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
            $('#reg_content').load('./index.php?c=main&a=viewschema');
        });

        $('#left_nav_setschema').bind('click',function(){
            $('#reg_content').load('./index.php?c=main&a=setschema');
        });
    }

    function loadAllWorks(){
        $('#reg_content').load('./index.php?c=main&a=allworks');
    }

    function loadAddWork() {
        $('#reg_content').load('./index.php?c=main&a=addwork');
    }

    exports.init = init;
});
