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

        $('#btn_reset').bind('click',function() {
            reset();
        });

        $('#btn_commit').bind('click',function() {
            var work_name = $('#work_name').val().trim();
            var work_dep = $('#work_dep').val().trim();
            var work_pos = $('#work_pos').val().trim();
            var work_mail = $('#work_mail').val().trim();
            var work_des = $('#work_des').val().trim();
            var work_title = $('#work_title').val().trim();


            if(work_name.trim()=="") {
                $('#loading_msg').text('姓名不能为空');
                $('#upload_loading').show();
                setTimeout(function(){
                    $('#upload_loading').hide();
                },1000);
                return;
            }

            if(work_dep.trim()=="") {
                $('#loading_msg').text('部门不能为空');
                $('#upload_loading').show();
                setTimeout(function(){
                    $('#upload_loading').hide();
                },1000);
                return;
            }

            if(work_pos.trim()=="") {
                $('#loading_msg').text('岗位不能为空');
                $('#upload_loading').show();
                setTimeout(function(){
                    $('#upload_loading').hide();
                },1000);
                return;
            }

            if(work_mail.trim()=="") {
                $('#loading_msg').text('邮箱不能为空');
                $('#upload_loading').show();
                setTimeout(function(){
                    $('#upload_loading').hide();
                },1000);
                return;
            }

            if(work_title.trim()=="") {
                $('#loading_msg').text('作品名称不能为空');
                $('#upload_loading').show();
                setTimeout(function(){
                    $('#upload_loading').hide();
                },1000);
                return;
            }

            if(work_des.trim()=="") {
                $('#loading_msg').text('作品简介不能为空');
                $('#upload_loading').show();
                setTimeout(function(){
                    $('#upload_loading').hide();
                },1000);
                return;
            }

            $('#upload_loading').show();
            $('#loading_msg').text('上传作品，请勿断网...');

            $.when(uploadImageTask(),uploadZipTask()).done(function(work_images_id,work_zip_id){
                var postArgs = {
                    'work_name':work_name,
                    'work_dep':work_dep,
                    'work_pos':work_pos,
                    'work_mail':work_mail,
                    'work_title':work_title,
                    'work_des':work_des,
                    'work_images_id':work_images_id,
                    'work_zip_id':work_zip_id
                };
                $.post('./index.php?c=work_mgr&a=addwork',postArgs,function(ret) {
                    console.log(ret);
                    $('#loading_msg').text('作品添加成功.');
                    reset();
                    setTimeout(function(){
                        $('#upload_loading').hide();
                    },1000);
                });

            });


        });
    }

    function reset() {
        $('#work_name').val('');
        $('#work_dep').val('');
        $('#work_pos').val('');
        $('#work_mail').val('');
        $('#work_des').val('');
        $('#work_images').val('');
        $('#work_zip').val('');
        $('#work_title').val('');
    }

    function uploadImageTask() {
        var def = $.Deferred();
        var work_images = $('#work_images').val();
        if(work_images.trim() != "") {
            $.ajaxFileUpload
            (
                {
                    url:'./index.php?c=work_mgr&a=upload_image',
                    secureuri:false,
                    fileElementId:'work_images',
                    dataType: 'json',
                    data:{"filetype":"image"},
                    success: function (data, status)
                    {
                        console.log(data);
                        def.resolve(data.info);

                    },
                    error: function (data, status, e)
                    {
                        console.log(e);
                        def.resolve('');
                    }
                }
            );
        } else {
            def.resolve('');
        }

        return def.promise();
    }

    function uploadZipTask() {
        var def = $.Deferred();
        var work_zip = $('#work_zip').val();
        if(work_zip.trim() != "") {
            $.ajaxFileUpload
            (
                {
                    url:'./index.php?c=work_mgr&a=upload_zip',
                    secureuri:false,
                    fileElementId:'work_zip',
                    dataType: 'json',
                    data:{"filetype":"zip"},
                    success: function (data, status)
                    {
                        console.log(data);
                        def.resolve(data.info);

                    },
                    error: function (data, status, e)
                    {
                        console.log(e);
                        def.resolve('');
                    }
                }
            );
        } else {
            def.resolve('');
        }

        return def.promise();
    }
    exports.init = init;
});