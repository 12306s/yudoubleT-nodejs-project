$(document).ready (function () {
    //点击退出登录，显示退出成功
    $('#logout').click(function () {
        $.get('/users/loginout', function (res) {
            if (res.code === 0) {
                alert('成功退出');
                // 首页- 刷新首页 - 判断是否有cookie
                // 用户管理页 - 刷新 - 判断是否有cookie
                location.reload();
            } else {
                alert('退出失败');
            }
        });
    });

    $("#addBrand").click (function () {
        $("#Abrand").show();
    });

    $("#cancel").click (function () {
        $("#Abrand").hide();
    });

    $("#confirmAdd").click (function () {
        //自己模拟form表单
        var formData = new FormData();
        formData.append('brandName', $("#brandName").val());
        formData.append('logo', $("#logo")[0].files[0]);
        // console.log($("#logo")[0].files[0]);
        $.ajax({
            url:'/mobile/brandAdd',
            method:'post',
            data: formData,
            contentType:false,
            processData:false,
            success:function (){

            },
            error:function (){
                
            }
        });
    });
});