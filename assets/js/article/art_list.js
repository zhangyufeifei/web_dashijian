$(function() {

    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage


    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补0的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }


    // 定义查询参数对象q, 请求数据的时候需要把q 提交到服务器
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页2条
        cate_id: '', // 文章分类的id
        state: '' // 文字的发布状态   
    };


    // 文章列表区域数据渲染
    // 发送请求，获取文章列表数据
    initTable()

    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // layer.msg(res.message)
                // console.log(res);


                // 使用模板引擎渲染页面
                var htmlstr = template('tpl-table', res)
                $('tbody').html(htmlstr)

                // 渲染分页
                renderPage(res.total)
            }
        })
    }



    // 发送请求，获取文章分类列表，渲染所有分类下拉菜单
    initCate()

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res);

                if (res.status !== 0) {
                    return layer.msg(res.message)
                }

                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }


    // 筛选功能
    // 为筛选表格添加提交事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault()

        // 拿到两个选择框里的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()

        // 为查询参数q，重新赋值
        q.cate_id = cate_id
        q.state = state

        // 重新渲染文章列表
        initTable()
    })



    // 渲染分页
    function renderPage(total) {
        // console.log(total);
        laypage.render({
            elem: 'pageBox', // 装分页的盒子
            count: total, // 总数据数
            limit: q.pagesize, // 每页需要显示的数据
            curr: q.pagenum, // 默认的起始页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [1, 2, 3, 5, 10],
            // 当分页发生变化的时候，会调用jump回调函数
            jump: function(obj, first) {
                // console.log(obj.curr);
                q.pagenum = obj.curr // 拿到点击的那个分页数据
                q.pagesize = obj.limit // 拿到最新的要每页显示的条数

                if (!first) {
                    initTable()
                }
            }
        })

    }


    // 删除功能
    $('table').on('click', '.btn-delete', function() {
        // 获取页面上删除按钮的个数
        var len = $('.btn-delete').length

        // 拿到点击删除对应的数据的id
        var id = $(this).attr('data-id')

        // 弹出层，询问是否删除
        layer.confirm('确认删除？', {
            icon: 3,
            title: '提示'
        }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)

                    if (len === 1) {
                        // len===1 就说明点击删除结束后，页面就没有数据了

                        // 注意：页面值最小是1，如果页面值已经是1了，就让页面值还是1，页码值不是1，才让页码值减1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })

            layer.close(index);
        });
    })




    // 文章编辑功能
    // 给编辑按钮动态绑定点击事件
    // $('table').on('click', '.btn-edit', function() {   })
})