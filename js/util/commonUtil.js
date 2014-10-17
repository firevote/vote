/**
 * Created by W.J.Chang on 2014/10/14.
 */

define(function(require,exports,module) {
    var commUtils = {};

    commUtils.doAjaxPost = function(url,data) {
        var def = $.Deferred();
        $.ajax({
            type: "POST",
            url: url,
            data:data,
            success: function (msg) {
                def.resolve(msg);
            },
            timeout:5000,
            error:function(msg) {
                def.resolve(msg);
            }
        });
        return def.promise();
    };

    exports.commUtils = commUtils;
});