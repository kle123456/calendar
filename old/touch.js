/**
 * Created by chenxingyu on 2017/1/21.
 */

function Touch(el){
    this.el = el;
    this.$el = $(el);
    this.init();
}

Touch.prototype.init = function (){
    this.bindEvent();
}

Touch.prototype.bindEvent = function (){
    var self = this;

    var hasEventListeners = !!window.addEventListener;
    var addEvent = function(el, e, callback, capture)
    {
        if (hasEventListeners) {
            el.addEventListener(e, callback, !!capture);
        } else {
            el.attachEvent('on' + e, callback);
        }
    };

    addEvent(self.el, 'touchstart', self.touchstart.bind(this));
    addEvent(self.el, 'touchmove', self._touchmove.bind(this));
    addEvent(self.el, 'touchend', self.touchend.bind(this));
}

Touch.prototype.touchstart = function(e)
{
    // debugger;
    var touch = e.changedTouches[0];
    var px = touch.pageX
    var py = touch.pageY
    this.touchData = {}
    this.touchData.startX = px
    this.touchData.startY = py
    this.touchData.startTime = new Date().getTime()
};

Touch.prototype._touchmove = function(e)
{
    // debugger;
    var self = this
    var touch = e.changedTouches[0];
    var px = touch.pageX;
    var py = touch.pageY;
    var distX = Math.abs(px - this.touchData.startX)
    var distY = Math.abs(py - this.touchData.startY)
    if (distX < 10 && distY < 10){
        return;
    }else if(distY > distX + 5){
        return;
    }
    e.preventDefault();
     var $date_body_box = $('.date-body-box');
     var   $date_body_main = self.$el.find('.date-body-main');

    var   _distX = px - this.touchData.startX,
        curX,
        newX;
    //curX = $scroll_wrap[0].style.webkitTransform.match(/\-?[0-9]+/g)[0] * 1
    curX = -($date_body_box.width());
    newX = curX + _distX;
    // console.log(self);
    $date_body_main[0].style.webkitTransform = 'translate('+newX+'px,0)'
};

Touch.prototype.touchend = function(e)
{
    // debugger;
    var self = this
    var touch = e.changedTouches[0];
    var time = self.scrollTime || 500;
    var startTime = this.touchData.startTime;
    var endTime = new Date().getTime();
    var px = touch.pageX;
    var distX = Math.abs(px - this.touchData.startX)
    var $date_body_box = $('.date-body-box');
    var   $date_body_main = self.$el.find('.date-body-main');

    var    _distX = px - this.touchData.startX,
        $scroll_box_w = $date_body_box.width()

    var dist;
    if (distX > $scroll_box_w / 2.5 || (endTime - startTime < 300 && distX > 60 )){
        if (_distX  < 0 ){
            dist = -$scroll_box_w * 2
        }else{
            dist = 0
        }
        setTimeout(function(){
            if (_distX < 0) {
                self.nextMonth();
            } else {
                self.prevMonth();
            }
        },time)
    }else{
        dist = -$scroll_box_w
    }

    if (distX > 10){
        $date_body_main[0].style.webkitTransitionDuration = time + 'ms'
        $date_body_main[0].style.webkitTransform = 'translate('+dist+'px,0)'
        setTimeout(function(){
            $date_body_main[0].style.webkitTransitionDuration = '0ms'
        },time)
    }
};

module.exports = Touch;
// window.onload = function (){
//     new Touch(document.querySelector('#touch'));
// };