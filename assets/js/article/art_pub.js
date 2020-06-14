$(function() {

    var layer = layui.layer
    var form = layui.form

    // 初始化富文本编辑器
    initEditor()

    // 动态渲染文章类别，下拉菜单内容
    initCate()

    function initCate() {
        // 发送请求，获取文章分类列表
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // console.log(res);

                // 用模板引擎，渲染下拉菜单
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)

                form.render()
            }
        })
    }

    // 选择封面
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)



    // 点击选择封面，实现选择文件
    $('#btnChooseImage').on('click', function() {
            $('#coverFile').click()
        })
        // 监听input：file的change事件，拿到用户上传的图片列表
    $('#coverFile').on('change', function(e) {
        // console.log(e);
        // 拿到用户选择的文件
        var files = e.target.files
        if (files.length === 0) {
            return
        }
        // 根据选择的文件， 创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(files[0])
            // 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })


    // 定义文章的发布状态
    // 默认定义为发布
    var art_state = '已发布'
        // 点击了存为草稿按钮，把变量修改为 草稿
    $('#btnsave2').on('click', function() {
        art_state = '草稿'
    })

    // 监听表单的提交事件，拿到表单里的值
    $('#form-pub').on('submit', function(e) {
        e.preventDefault()

        var fd = new FormData($(this)[0])

        // 将文章的发布状态，追加到fd中
        fd.append('state', art_state)



        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)


                // fd.forEach(function (v, k) {
                //     console.log(k, v);
                // })


                // 发送请求
                publishArticle(fd)
            })
    })


    // 发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)

                // 发布文章成功后，跳转到文章列表页面
                location.href = '/article/art_list.html'

            }
        })
    }

})