/**
 * Created by chenxingyu on 2017/1/19.
 */

window.requestAnimFrame = (function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || function ( callback, /* DOMElement Element */ element) {
            return window.setTimeout(callback, 1000 / 60);
        };
})();

window.cancelAnimFrame = (function () {
    return window.cancelAnimationFrame || window.webkitCancelAnimationFrame || clearTimeout;
})();

var $load_box = $('.load-box');

module.exports = {
    // 返回对象的类型
    type: function type(obj) {
        var type;
        if (obj == null) {
            type = String(obj);
        } else {
            type = {}.toString.call(obj).toLowerCase();
            type = type.substring(8, type.length - 1);
        }
        return type || "object";
    },
    //显示loading
    loadShow : function loadShow(){
        $load_box.show();
    },
    //隐藏loading
    loadHide : function loadHide(){
        $load_box.hide();
    },
    //获取数据
    getData : function getData(requestOpts) {
        var nothing = function nothing() {
        };
        var opts = {
            url: '',
            type: 'GET',
            data: {},
            success: nothing,
            error: function (){
                alert('网络发生错误,请检查网~~');
                common.loadHide();
            },
        };

        //合并参数
        opts = $.extend(opts, requestOpts);

        //发起请求
        $.ajax(opts);
    }

};