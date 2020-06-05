$.ajaxPrefilter(function(options) {
    // 在发送请求的时候，options接受请求的参数
    options.url = 'http://ajax.frontend.itheima.net' + options.url
})