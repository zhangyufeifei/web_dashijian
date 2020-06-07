$(function() {
    // 生成 layui的form元素
    var form = layui.form;
    var layer = layui.layer;

    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称的长度必须在 1~6 个字符之间'
            }
        }
    })

    initUserInfo();

    // 初始化用户信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！')
                }
                // console.log(res);

                // 调用 form.val()方法快速为表单赋值
                form.val('formUserInfo', res.data)
            }
        })
    }


    // 点击重置按钮实现重置功能
    $('#btnReset').on('click', function(e) {
        // 阻止默认重置功能
        e.preventDefault()

        // 这个的重置原理:再次调用initUserInfo（）函数吗，把用户信息再次渲染一遍
        initUserInfo()
    })

    // 点击提交修改(表单提交submit事件)，更新用户信息
    $('.layui-form').on('submit', function(e) {
        e.preventDefault()

        // console.log($(this).serialize());

        // 调用接口，发送请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('res.message')
                }
                layer.msg('用户信息更新成功！')

                // 信息更新完成再次渲染用户头像和信息
                // 调用index.js 文件中的getUserInfo（）函数
                // window是当前iframe 便签里的 userinfo
                // window.parent是他的父级别，index，就可以直接调用它的getUserInfo函数
                window.parent.getUserInfo()

            }
        })
    })
})