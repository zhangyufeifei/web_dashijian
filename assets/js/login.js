$(function() {
    // 点击去注册，显示注册div，隐藏登录div
    $('#link-login').on('click', function() {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    $('#link-reg').on('click', function() {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    // 设定自定义验证规则
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        // 校验密码
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 校验两次密码是否一致
        repwd: function(value) {
            // value 是确认密码框里的内筒
            // 还要在拿到密码框里的内筒
            // 进行比较
            // 如果判断失败就 return一个错误信息
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致！'
            }
        }
    })


    // 实现登录功能
    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
        e.preventDefault()
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }
        $.post('/api/reguser',
            data,
            function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('注册成功，请登录');
                $('#link-reg').click();
            })
    })

    // 监听登录表单的提交事件
    $('#form_login').submit(function(e) {
        e.preventDefault()
            // 发送登录的ajax请求
        $.ajax({
            url: '/api/login',
            method: 'POST',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('登录成功');

                // 将登录成功的 token 字符串保存到 localStorage
                localStorage.setItem('token', res.token);
                // 登录成功跳转到index页面
                location.href = '/index.html'
            }
        })
    })




})