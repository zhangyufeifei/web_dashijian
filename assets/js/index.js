$(function() {
    // 调用getUserInfo函数，获取用户信息
    getUserInfo()

    var layer = layui.layer;
    // 退出功能
    // 给退出按钮绑定点击事件
    $('#btnLogout').on('click', function() {
        // 提示用户是否退出
        layer.confirm('确定退出登录？', {
            icon: 3,
            title: '提示'
        }, function(index) {
            // 清空本地存储中的token
            localStorage.removeItem('token');
            // 跳转到登录页面 
            location.href = '/login.html'


            layer.close(index);
        });
    })
})

// 定义发送请求的函数吗，获取用户信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            renderAvatar(res.data)
                // console.log(res)
        },
        // complete: function(res) {
        //     // console.log(res);
        //     if (res.responseJSON.status == 1 && res.responseJSON.message == '身份认证失败！') {
        //         // 清空本地存储中的token
        //         localStorage.removeItem('token');
        //         // 跳转到登录页面 
        //         location.href = '/login.html'
        //     }
        // }
    })
}

// 定义渲染用户头像的函数
function renderAvatar(user) {
    // 获取用户的名字
    var name = user.nickname || user.username;
    // 渲染用户名字
    $('.welcome').html('欢迎&nbsp;&nbsp;' + name)

    // 按需渲染用户头像
    if (user.user_pic !== null) {
        // 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        // 渲染文本头像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()

    }
}