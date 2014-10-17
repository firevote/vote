/**
 * Created by W.J.Chang on 14-6-24.
 */

define(function(require,exports,module) {

    function init() {
        bindEvent();
        //loadAllWorks();
        //loadAddWork();
        //loadSchema();
        loadSchemaSetting();
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

        $('#top_nav_work').bind('click',function(){
            $('#left_nav_allworks').trigger('click');
        });

        $('#top_nav_schema').bind('click',function(){
            $('#left_nav_viewschema').trigger('click');
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

    exports.init = init;
});
