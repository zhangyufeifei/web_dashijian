$.ajaxPrefilter(function(options) {
    // 在发送请求的时候，options接受请求的参数
    options.url = 'http://ajax.frontend.itheima.net' + options.url

    // 统一为有权限的接口，设置header请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 全局统一挂载 complete 回调函数
    options.complete = function(res) {
        if (res.responseJSON.status == 1 && res.responseJSON.message == '身份认证失败！') {
            // 清空本地存储中的token
            localStorage.removeItem('token');
            // 跳转到登录页面 
            location.href = '/login.html'
        }
    }
})