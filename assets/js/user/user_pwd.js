$(function() {

    var form = layui.form;

    // 为密码框校验规则
    form.verify({
        // 所有密码框的验证规则
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],

        // 新密码框验证规则： 新密码要和旧密码不一样
        // 规则用在哪个input中，value就是哪个input里的值
        samePwd: function(value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同！'
            }
        },

        // 确认新密码框验证规则： 新密码和确认新密码的内筒要一致
        rePwd: function(value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致！'
            }
        }
    })


    // 发送请求，修改密码
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();

        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更新密码失败！')
                }
                layui.layer.msg('更新密码成功！')

                // 重置表单
                $('.layui-form')[0].reset()
            }
        })
    })
})