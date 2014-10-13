/**
 * Created by W.J.Chang on 2014/10/13.
 */
define(function(require,exports,module){

    function init() {
        bindEvent();
    }

    function bindEvent() {
        $('#work_des').bind('focus',function(){
            $(this).prop('rows',10);
        });

        $('#work_des').bind('blur',function(){
            $(this).prop('rows',2);
        });

        $('#work_images').uploadify({
            'swf':'template/index/uploadify.swf',
            'uploader':''
        });
    }

    exports.init = init;
});