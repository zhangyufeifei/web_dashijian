$(function() {

    var layer = layui.layer
    var form = layui.form

    // 渲染文章分类列表功能
    initArtCateList();
    // 获取文章分类列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }


    // 添加类别功能
    // 给 添加类别按钮添加点击事件
    var indexAdd = null
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    })

    // 用代理的方式，给表单 form-add  添加submit事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault()

        // 调用接口，发送请求
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增文章分类失败！')
                }

                initArtCateList()
                layer.msg('新增文章分类成功！')

                layer.close(indexAdd)
            }
        })
    })


    // 编辑功能
    // 点击编辑按钮实现编辑功能
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function() {
        // 点击按钮弹出弹出层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });

        // 点击按钮，拿到对应按钮的id
        var id = $(this).attr('data-id')

        // 根据id 发送请求， 拿到id对应的文章分类数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                // console.log(res);
                // 快速为form-edit表单中插入数据
                form.val('form-edit', res.data)
            }
        })
    })

    // 点击确认修改(表单的submit事件)，更新文章分类数据
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()
        var data = $(this).serialize()
        console.log(data);

        // 发送请求，把数据上传到服务器
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)

                // 关闭弹出层
                layer.close(indexEdit)

                // 重新渲染文章分类列表
                initArtCateList()
            }

        })
    })



    // 点击删除按钮实现删除功能
    $('tbody').on('click', '.btn-del', function() {
        // console.log('ok');
        // 拿到对应id
        var id = $(this).attr('data-id')
            // console.log(id);

        // 发送请求，根据id删除文章分类
        $.ajax({
            method: 'GET',
            url: '/my/article/deletecate/' + id,
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)

                // 重新渲染文章列表
                initArtCateList()
            }
        })

    })
})