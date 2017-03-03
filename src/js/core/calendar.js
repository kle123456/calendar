/**
 * Created by chenxingyu on 2017/1/19.
 */

import common from './common';
import calendarInfo from './calendar_info';
import Iscroll from './iscroll';

var _iScroll;

var nothing = function nothing() {
};

var defaults = {
    currYear: -1,              // 当前年
    currMonth: -1,             // 当前月，0-11
    calendarInit: nothing,     //日历初始化回调
    beforeDrawCld: nothing,       // 画日历之前调用函数
    afterDrawCld: nothing,        // 画日历之后调用函数
    dbClickDay: nothing,           // 双击某一天执行事件
    clickDay: nothing,             // 单击某一天执行事件
    callFunc: nothing              // 调用函数
};

//构造函数
function Calendar(options) {
    this.options = options || {};
    //是否切换月 否则切换每周
    this.isSwitchMonth = true;
    //是否是第一次显示日历
    this.firstShow = true;
    this.selection = {
        currYear: -1,
        currMonth: -1,

        minYear: 1901,
        maxYear: 2100,

        tmpYear: -1,
        tmpMonth: -1,
    };

    //初始化
    this.init();
}


//日历初始化
Calendar.prototype.init = function init() {

    this.calendarInfo = calendarInfo;

    //合并配置对象
    this.setConfig();

    this.options.currYear = this.today.tY();    // 当前年
    this.options.currMonth = this.today.tM();   // 当前月
    this.options.currDay = this.today.tD();   // 当前日

    var self = this;

    function initCallback() {
        //获取元素
        self.getElement();

        //生成html
        self.drawOutline(self.options);

        //初始化顶部的工具栏
        self.initControlBar();

        //初始化selection对象
        self.selectionInit();

        //循环渲染日历
        self.forEachDrawCldThree();

        //回调函数
        if (self.options.callFunc) {
            self.options.callFunc();
        }

        //初始化日历客户端信息
        self.dateClientInfoInit();

        //绑定事件
        self.bindEvent();

    }

    //传回调函数来进行初始化
    this.options.calendarInit && this.options.calendarInit(this, initCallback);

};


//合并配置对象
Calendar.prototype.setConfig = function setConfig() {
    this.options = $.extend(defaults, this.options); // 扩展options选项
};

//获取元素
Calendar.prototype.getElement = function getElement() {
    var $date_wrap = $('#date-wrap');
    this.$date_wrap = $date_wrap;
    this.$date_bar_box = $date_wrap.find('.date-bar-box');
    this.$date_head = $date_wrap.find('.date-head');
    this.$date_body_wrap = $date_wrap.find('.date-body-wrap');
    this.$date_body_box = $date_wrap.find('.date-body-box');
    this.$date_body_main = $date_wrap.find('.date-body-main');
    this.$date_body_item = $date_wrap.find('.date-body-item');

    //选择年月
    this.$year_list = this.$date_bar_box.find(".year-list");
    this.$month_list = this.$date_bar_box.find(".month-list");

    //日历信息盒子
    this.$date_info = $('.date-info');
};

//绑定事件
Calendar.prototype.bindEvent = function bindEvent() {
    var $doc = $(document);

    //上一月
    $doc.on('click', '#prevMonth', this.goPrevMonth.bind(this));

    //下一月
    $doc.on('click', '#nextMonth', this.goNextMonth.bind(this));

    //月份列表改变 ， 去某一月
    $doc.on('change', '.month-list', function (event) {
        var month = Number(event.currentTarget.value) - 1;
        this.goMonth(month);
    }.bind(this));

    //上一年
    $doc.on('click', '#prevYear', this.goPrevYear.bind(this));

    //下一年
    $doc.on('click', '#prevYear', this.goNextYear.bind(this));

    //新年列表改变 , 去某一年
    $doc.on('change', '.year-list', function (event) {
        var year = Number(event.currentTarget.value);
        this.goYear(year);
    }.bind(this));

    //点击日历事件
    $doc.on('click', '.date-item', function (e) {
        var $currentTarget = $(e.currentTarget);
        var currentYear = $currentTarget.attr('data-year');
        if (currentYear !== undefined) {
            var currentMonth = $currentTarget.attr('data-month');
            var currentSolor = $currentTarget.attr('data-solor');

            this.$currentTarget = $currentTarget;
            this.$date_body_main.find('.date-item').removeClass('active');
            $currentTarget.addClass('active');

            this.options.currYear = Number(currentYear);    // 当前年
            this.options.currMonth = Number(currentMonth);   // 当前月
            this.options.currDay = Number(currentSolor);   // 当前日

            //更新index
            this.dateClientInfo.todayIndex = $currentTarget.closest('.date-row-item').index();
            //更新选中的高度
            this.dateClientInfo.todayHeight = this.dateClientInfo.todayIndex * this.dateClientInfo.dateRowHeight;

            //显示日历详情
            this.showDateDetail($currentTarget);

            //执行回调函数
            this.options.clickDay ? this.options.clickDay(this) : '';
        }
    }.bind(this));

    // 返回今天
    $doc.on('click', '#today-btn', function (){
        this.goToday();

        //要触发两次才行？
        var $today = $('.today.date-item');
        if (!$today.hasClass('active')) {
            $today.trigger('click');
            setTimeout(function(){
                $today.trigger('click');
            },10);
        }
    }.bind(this));

    /**
     *  touch事件左右切换日历 ，切换上/下月
     *
     **/
    $doc.on('touchstart', '.date-body-box', this.touchstartChangeMonth.bind(this));
    $doc.on('touchmove', '.date-body-box', this.touchmoveChangeMonth.bind(this));
    $doc.on('touchend', '.date-body-box', this.touchendChangeMonth.bind(this));

    /**
     * 向上向下拖动
     *
     **/
    this.touchY = {};
    this.touchY.min_move_size = 50;
    this.touchY.max_move_size = this.dateClientInfo.dateHeight - this.dateClientInfo.dateHeadHeight - this.dateClientInfo.dateRowHeight;
    this.touchY.move_size_y = 0;
    this.touchY.now_top = 0;

    $doc.on('touchstart', '.date-info', this.dateMoveUpDownStart.bind(this));
    $doc.on('touchmove', '.date-info', function (e) {
        //获取手指滑动到当前位置的x ， y坐标
        var move_x = parseInt(e.touches[0].screenX);
        var move_y = parseInt(e.touches[0].screenY);

        window.requestAnimFrame(function () {
            this.dateMoveUpDownMove(e, move_x, move_y);
        }.bind(this));

    }.bind(this));
    $doc.on('touchend', '.date-info', this.dateMoveUpDownEnd.bind(this));

    /**
     * 切换每周
     *
     **/
    // this.touchRowDataX = {};
    // this.touchRowDataX.min_move_size = 50;
    // this.touchRowDataX.move_size_x = 0;
    // this.touchRowDataX.now_left = 0;
    // this.touchRowDataX.index = todayIndex;
    //
    //
    // $doc.on('touchstart','.date-body-item',function (e){
    //     // debugger;
    //     e.stopPropagation();
    //     e.preventDefault();
    //
    //     if (this.isSwitchMonth === true) {
    //         return;
    //     }
    //
    //     var style = $('.date-body-item').eq(1).css('transform');
    //
    //     this.touchRowDataX.now_left = Number(style.slice(style.indexOf('(') + 1,style.indexOf(',')).replace(/px/,''));
    //
    //     this.touchRowDataX.point_x = this.touchRowDataX.start_x = parseInt(e.touches[0].screenX);
    //
    // }.bind(this));
    //
    // $doc.on('touchmove','.date-body-item',function (e){
    //     e.stopPropagation();
    //     e.preventDefault();
    //
    //     if (this.isSwitchMonth === true) {
    //         return;
    //     }
    //
    //     var self = this;
    //     //获取手指滑动到当前位置的x ， y坐标
    //     var move_x = parseInt(e.touches[0].screenX);
    //     var move_y = parseInt(e.touches[0].screenY);
    //
    //     //移动的x值减去 触摸时的 x值
    //     var changeX = move_x - (self.touchRowDataX.point_x === null ? move_x : self.touchRowDataX.point_x);  //需要判断move_start的值？
    //     //移动的y值减去 触摸时的 y值
    //     var changeY = move_y - (self.touchY.point_y === null ? move_y : self.touchY.point_y);
    //     var notPreventDefault = false;
    //     var sin = changeY / Math.sqrt(changeX * changeX + changeY * changeY);
    //
    //     if (sin > Math.sin(Math.PI / 3) || sin < -Math.sin(Math.PI / 3)) {//滑动屏幕角度范围：PI/3  -- 2PI/3
    //         notPreventDefault = true;  //不阻止默认行为
    //     }
    //
    //     self.touchRowDataX.now_left = self.touchRowDataX.now_left + changeX;  //现在x坐标的位置
    //
    //     self.touchRowDataX.is_move_left = move_x - self.touchRowDataX.start_x < 0;  //是否向左移动
    //
    //     self.touchRowDataX.point_x = move_x;
    //
    //     $('.date-body-item').eq(1).css(this.translateX(2, self.touchRowDataX.now_left));
    //
    //     return notPreventDefault;
    //
    // }.bind(this));
    //
    // $doc.on('touchend','.date-body-item',function (e){
    //     e.stopPropagation();
    //     e.preventDefault();
    //     console.log(1);
    //
    //     var self = this;
    //
    //     if (self.touchRowDataX.is_move_left) {
    //
    //     }
    // });
};

//日历客户端信息初始化
Calendar.prototype.dateClientInfoInit = function dateClientInfoInit() {
    this.dateClientInfo = {
        dateHeight: this.$date_wrap.height(),                                             //总高度
        dateHeadHeight: this.$date_bar_box.height() + this.$date_head.height(),           //日历头部高度
        dateBodyHeight: this.$date_body_wrap.height(),                                    //日历内容高度
        dateRowHeight: this.$date_body_item.eq(0).find('.date-row-item').eq(0).height(),  //一行的高
        todayIndex: $('.date-item.today').closest('.date-row-item').index(),                        //今天所在行的而索引
    };

    this.dateClientInfo.todayHeight = this.dateClientInfo.todayIndex * this.dateClientInfo.dateRowHeight;
};

//向上下滑动 touchstart 处理函数
Calendar.prototype.dateMoveUpDownStart = function dateMoveUpDownStart(e) {
    e.preventDefault();

    this.touchY.point_y = this.touchY.start_y = parseInt(e.touches[0].screenY);
    this.touchY.point_x = this.touchY.start_x = parseInt(e.touches[0].screenX);
};

//向上下滑动 touchmove 处理函数
Calendar.prototype.dateMoveUpDownMove = function dateMoveUpDownMove(e, move_x, move_y) {
    var $currentTarget = $(e.currentTarget);
    var self = this;
    //移动的x值减去 触摸时的 x值
    var changeX = move_x - (self.touchY.point_x === null ? move_x : self.touchY.point_x);  //需要判断move_start的值？
    //移动的y值减去 触摸时的 y值
    var changeY = move_y - (self.touchY.point_y === null ? move_y : self.touchY.point_y);
    var notPreventDefault = false;
    var sin = changeY / Math.sqrt(changeX * changeX + changeY * changeY);

    if (sin > Math.sin(Math.PI / 3) || sin < -Math.sin(Math.PI / 3)) {//滑动屏幕角度范围：PI/3  -- 2PI/3
        notPreventDefault = true;  //不阻止默认行为
    }

    self.touchY.now_top = self.touchY.now_top + changeY;    //现在y坐标的位置
    self.touchY.is_move_top = move_y - self.touchY.start_y < 0;   //是否向上移动

    self.touchY.point_y = move_y;


    //如果还没滑懂到顶部
    if (!this.isMoveTop) {
        e.preventDefault();

        if (self.touchY.now_top > self.touchY.max_move_size) {
            // debugger;
            self.touchY.now_top = self.touchY.max_move_size;
        } else if (self.touchY.now_top < -self.touchY.max_move_size) {
            // debugger;
            self.touchY.now_top = -self.touchY.max_move_size;

        } else if (self.touchY.now_top > 0) {
            // debugger;
            self.touchY.now_top = 0;
        }

        //清除切换每周的样式
        // var $date_body_item = $('.date-body-item').eq(1);
        // if ($date_body_item.hasClass('display-box')) {
        //     $date_body_item.removeClass('display-box');
        //     $date_body_item.attr('style', '');
        // }

        var top = self.touchY.now_top;

        //设置该盒子的偏移样式
        $currentTarget.css(self.translateY(2, top ));

        //日历向上向下偏移
        if (self.touchY.max_move_size + top < this.dateClientInfo.todayHeight) {
            var y = (top + ((5 - this.dateClientInfo.todayIndex) * this.dateClientInfo.dateRowHeight)) ;
            self.$date_body_box.css(self.translateY(2, y));
        }

        return notPreventDefault;
    }
};

//向上下滑动 touchend 处理函数
Calendar.prototype.dateMoveUpDownEnd = function dateMoveUpDownEnd(e) {
    // e.preventDefault();
    var self = this;
    var $currentTarget = $(e.currentTarget);
    var top;

    if (this.touchY.is_move_top) {

        if (this.touchY.now_top <= -this.touchY.min_move_size) {

            top = -this.touchY.max_move_size;
            this.isSwitchMonth = false;

            if (!this.isMoveTop) {
                $currentTarget.height($(window).height() - (this.dateClientInfo.dateHeadHeight + this.dateClientInfo.dateRowHeight));
                this.isMoveTop = true;

                _iScroll = new Iscroll(this.$date_info[0], {
                    hScroll: false,
                    vScroll: true,
                    onScrollMove: function (e) {
                        if (_iScroll.y >= 0) {
                            //摧毁
                            _iScroll.destroy();
                            _iScroll = null;
                            self.isMoveTop = false;
                            $currentTarget[0].style.height = '';
                        }
                    },

                });
            }

        } else {
            top = 0;
            this.isSwitchMonth = true;
        }
    } else {

        if (this.touchY.now_top >= -(this.touchY.max_move_size - this.touchY.min_move_size)) {
            // debugger;
            if (!this.isMoveTop) {
                top = 0;
                this.isSwitchMonth = true;
            } else {
                top = -this.touchY.max_move_size;
            }

        } else {
            top = -this.touchY.max_move_size;
            this.isSwitchMonth = false;
        }
    }

    //设置top值
    this.touchY.now_top = top ;

    //等于指定值时才偏移
    if (top === 0 || top === -this.touchY.max_move_size) {
        var y;
        //设置该盒子的偏移样式
        $currentTarget.css(this.translateY(1, top));

        if (top === 0) {
            y = 0;
        } else {
            //设置切换每周的样式
            // setTimeout(function(){
            //     // debugger;
            //     $('.date-body-item').eq(1).addClass('display-box');
            //     $('.date-body-item').eq(1).css(this.translateX(2, -($('.date-body-item').eq(1).width() * (todayIndex))));
            //
            //     $('.date-body-box').attr('style','');
            // }.bind(this),400);

            if ((this.touchY.max_move_size + top) < this.dateClientInfo.todayHeight) {
                y = (top + ((5 - this.dateClientInfo.todayIndex) * this.dateClientInfo.dateRowHeight));
            }
        }

        this.$date_body_box.css(this.translateY(1, y));
    }
};

/**
 * 获取动画样式，要兼容更多浏览器，可以扩展该方法
 * @int fig : 1 动画  2 没动画
 * return object
 **/
Calendar.prototype.translateY = function translateY(fig, y) {
    var time = fig == 1 ? 500 : 0;
    return {
        '-webkit-transition': '-webkit-transform ' + time + 'ms ease',
        'transition': 'transform ' + time + 'ms ease',
        '-webkit-transform': 'translate3d(0,' + y + 'px,0)',
        'transform': 'translate3d(0,' + y + 'px,0)'
    };
};

Calendar.prototype.translateX = function translateX(fig, x) {
    var time = fig == 1 ? 500 : 0;
    return {
        '-webkit-transition': '-webkit-transform ' + time + 'ms ease',
        'transition': 'transform ' + time + 'ms ease',
        '-webkit-transform': 'translate3d(' + x + 'px, 0 ,0)',
        'transform': 'translate3d(' + x + 'px, 0, 0)'
    };
};

//touchstart 切换月份处理程序
Calendar.prototype.touchstartChangeMonth = function (e) {
    // e.preventDefault();
    // e.stopPropagation();
    // if (this.isSwitchMonth === false) {
    //     return;
    // }

    var touch = e.changedTouches[0];
    var px = touch.pageX;
    var py = touch.pageY;
    this.touchData = {};
    this.touchData.startX = px;
    this.touchData.startY = py;
    this.touchData.startTime = new Date().getTime();
};

//touchmove 切换月份处理程序
Calendar.prototype.touchmoveChangeMonth = function (e) {
    // e.preventDefault();
    // e.stopPropagation();
    // if (this.isSwitchMonth === false) {
    //     return;
    // }
    var touch = e.changedTouches[0];
    var px = touch.pageX;
    var py = touch.pageY;
    var distX = Math.abs(px - this.touchData.startX);
    var distY = Math.abs(py - this.touchData.startY);
    if (distX < 10 && distY < 10) {
        return;
    } else if (distY > distX + 5) {
        return;
    }
    e.preventDefault();
    // debugger;
    var _distX = px - this.touchData.startX;
    var curX;
    var newX;
    curX = -(this.$date_body_box.width());
    newX = curX + _distX;
    this.$date_body_main[0].style.webkitTransform = 'translate3d(' + newX + 'px, 0 , 0)';
};

//touchend 切换月份处理程序
Calendar.prototype.touchendChangeMonth = function (e) {
    // e.preventDefault();
    // e.stopPropagation();
    // if (this.isSwitchMonth === false) {
    //     return;
    // }

    var self = this;
    var touch = e.changedTouches[0];
    var time = self.scrollTime || 500;
    var startTime = this.touchData.startTime;
    var endTime = new Date().getTime();
    var px = touch.pageX;
    var distX = Math.abs(px - this.touchData.startX);
    var _distX = px - this.touchData.startX;
    var scroll_w = this.$date_body_box.width();

    var dist;
    if (distX > scroll_w / 2.5 || (endTime - startTime < 300 && distX > 60 )) {
        if (_distX < 0) {
            dist = -scroll_w * 2
        } else {
            dist = 0
        }

        //重新渲染
        setTimeout(function () {
            if (_distX < 0) {
                self.nextMonth();
            } else {
                self.prevMonth();
            }

            self.options.currYear = self.selection.currYear;
            self.options.currMonth = self.selection.currMonth;

            //刷新顶部的工具栏
            self.freshControlBar();

            self.drawOutline(self.options);

            //循环渲染日历
            self.forEachDrawCldThree();
        }, time)
    } else {
        dist = -scroll_w
    }

    //过度动画
    if (distX > 10) {
        var dateBodyMain = this.$date_body_main[0];
        dateBodyMain.style.webkitTransitionDuration = time + 'ms';
        dateBodyMain.style.webkitTransform = 'translate3d(' + dist + 'px, 0, 0)';
        setTimeout(function () {
            dateBodyMain.style.webkitTransitionDuration = '0ms';
        }, time)
    }
};

//循环渲染3个
Calendar.prototype.forEachDrawCldThree = function forEachDrawCldThree() {
    var currYear;
    var currMonth;
    var $curdateBodyItem;
    var year;
    var beforeDrawCldFn;
    var afterDrawCldFn;

    for (var i = 0, len = 3; i < len; i++) {
        afterDrawCldFn = null;
        beforeDrawCldFn = null;
        //上一个月
        if (i === 0) {
            currMonth = this.options.currMonth - 1;
            currYear = this.options.currYear;
            if (currMonth === -1) {
                year = this.selection.currYear - 1;
                if (year >= this.selection.minYear) {
                    currMonth = 11;
                    currYear = this.options.currYear - 1;
                } else {
                    currMonth = 0;
                }
            }

            //开始绘画日历之前回调函数
            beforeDrawCldFn = this.options.beforeDrawCld;

        }
        //当前月
        else if (i === 1) {

            currMonth = this.options.currMonth;
            currYear = this.options.currYear;

            afterDrawCldFn = this.options.afterDrawCld;

            //设置偏移样式
            this.$date_body_main.attr({
                'style': '-webkit-transform:translate3d(' + -this.$date_body_box.width() + 'px, 0, 0)'
            });

        }
        //下一月
        else if (i === 2) {
            currYear = this.options.currYear;
            currMonth = this.options.currMonth + 1;

            if (currMonth > 11) {
                year = this.selection.currYear + 1;
                if (year <= this.selection.maxYear) {
                    currMonth = 0;
                    currYear = this.options.currYear + 1;
                } else {
                    currMonth = 0;
                }
            }
        }

        //获取盒子
        $curdateBodyItem = this.$date_body_item.eq(i);
        //绘制
        this.drawCld($curdateBodyItem, currYear, currMonth, beforeDrawCldFn, afterDrawCldFn);
    }
};


//初始化selection对象
Calendar.prototype.selectionInit = function selectionInit(year, month) {
    if (year === undefined || month === undefined) {
        year = this.options.currYear;
        month = this.options.currMonth;
    }

    this.setYear(year);
    this.setMonth(month);
};

//设置年
Calendar.prototype.setYear = function setYear(year) {
    if (this.selection.currYear != -1) {
        this.selection.tmpYear = this.selection.currYear;
    }
    this.selection.currYear = year;
};

//设置月
Calendar.prototype.setMonth = function setMonth(month) {
    if (this.selection.currMonth != -1) {
        this.selection.tmpMonth = this.selection.currMonth;
    }
    this.selection.currMonth = month;
};


//上一月处理函数
Calendar.prototype.prevMonth = function prevMonth() {
    // debugger;
    var month = this.selection.currMonth - 1;
    if (month === -1) {
        var year = this.selection.currYear - 1;
        if (year >= this.selection.minYear) {
            month = 11;
            this.setYear(year);
        } else {
            month = 0;
        }
    }
    this.setMonth(month);
};

//下一页处理函数
Calendar.prototype.nextMonth = function nextMonth() {
    var month = this.selection.currMonth + 1;
    if (month == 12) {
        var year = this.selection.currYear + 1;
        if (year <= this.selection.maxYear) {
            month = 0;
            this.setYear(year);
        } else {
            month = 11;
        }
    }
    this.setMonth(month);
};

//上一年处理函数
Calendar.prototype.prevYear = function prevYear() {
    var year = this.selection.currYear - 1;
    if (year >= this.selection.minYear) {
        this.setYear(year);
    }
};

//下一年处理函数
Calendar.prototype.nextYear = function nextYear() {
    var year = this.selection.currYear + 1;
    if (year <= this.selection.maxYear) {
        this.setYear(year);
    }
};


//提交更改
Calendar.prototype.commit = function commit() {
    if (this.selection.tmpYear != -1 || this.selection.tmpMonth != -1) {
        // 如果发生了变化
        if (this.selection.currYear !== this.selection.tmpYear || this.selection.currMonth !== this.selection.tmpMonth) {

            // 执行某操作
            this.changeView();

            this.freshControlBar();
        }

        // this.selection.tmpYear = -1;
        // this.selection.tmpMonth = -1;
    }
};


/**
 * 重新画日历
 * @return {[type]} [description]
 */
Calendar.prototype.changeView = function changeView() {
    this.options.currYear = this.selection.currYear;
    this.options.currMonth = this.selection.currMonth;

    //绘制轮廓
    this.drawOutline(this.options);

    //绘制日历
    this.forEachDrawCldThree();
    // this.drawCld(this.options.currYear, this.options.currMonth, this.options.afterDrawCld);
};


/**
 * 刷新工具栏
 */
Calendar.prototype.freshControlBar = function freshControlBar() {
    // 设置当前选中的年
    var $year_list = this.$year_list;
    $year_list.find('option').eq($year_list[0].selectedIndex).prop('selected', false);
    $year_list.find('option[value="' + this.options.currYear + '"]').prop('selected', true);

    // 设置当前选中的月
    var $month_list = this.$month_list;
    var month = this.options.currMonth + 1;      // 实际月
    $month_list.find('option').eq($month_list[0].selectedIndex).prop('selected', false);
    $month_list.find('option[value="' + month + '"]').prop('selected', true);

};

//去到今天
Calendar.prototype.goToday = function goToday() {
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth();

    if (this.selection.currYear != year || this.selection.currMonth != month) {
        this.selectionInit(year, month);
        this.commit();
    }
};

//去到某一年
Calendar.prototype.goYear = function goYear(year) {
    this.setYear(year);
    this.commit();
};

//去到某一月
Calendar.prototype.goMonth = function (month) {
    this.setMonth(month);
    this.commit();
};

//去上一年
Calendar.prototype.goPrevYear = function goPrevYear() {
    this.prevYear();
    this.commit();
};

//去上一年
Calendar.prototype.goNextYear = function goNextYear() {
    this.nextYear();
    this.commit();
};

//去上一月
Calendar.prototype.goPrevMonth = function goPrevMonth() {
    this.prevMonth();
    this.commit();
};

//去下一月
Calendar.prototype.goNextMonth = function goNextMonth() {
    this.nextMonth();
    this.commit();
};


/**
 * 生成html 画表格轮廓
 * @return null
 */
Calendar.prototype.drawOutline = function drawOutline() {

    for (var item = 0, len = 3; item < len; item++) {
        var html = '';
        var $curDateBodyItem = this.$date_body_item.eq(item);
        for (var i = 0; i < 6; i++) {

            html = html + '<div class="date-row-item display-box">';

            for (var j = 0; j < 7; j++) {
                //星期天添加样式
                var className = '';
                if (j === 0 || j === 6) {
                    className = 'weekend';
                }

                html = html + '<div class="date-item box1-column-center ' + className + '">' +
                    '<span class="marketing-tips"></span>' +
                    '<span class="solar solar-calendar"></span>' +
                    '<span class="lunar lunar-calendar"></span>' +
                    '</div>';
            }
            html = html + '</div>';
        }

        $curDateBodyItem.html(html);
    }
};


/**
 * 初始化顶部的工具栏
 */
Calendar.prototype.initControlBar = function initControlBar() {
    var i;
    // 设置选中的年为当前的年
    var tY = this.today.tY();
    var htmlYear = '';
    for (i = 1901; i <= 2100; i++) {
        if (i == tY)
            htmlYear = htmlYear + '<option value="' + i + '" selected="selected">' + i + '年</option>';
        else {
            htmlYear = htmlYear + '<option value="' + i + '">' + i + '年</option>';
        }
    }

    // 设置月的选项
    var tM = this.today.tM() + 1;
    var htmlMonth = "";
    for (i = 1; i <= 12; i++) {
        if (i == tM)
            htmlMonth += '<option value="' + i + '" selected="selected">' + i + '月</option>';
        else {
            htmlMonth += '<option value="' + i + '">' + i + '月</option>';
        }
    }

    //渲染
    this.$year_list.html(htmlYear);
    this.$month_list.html(htmlMonth);
};


/**
 * 返回本月的所有数据
 * @param  int y 年
 * @param  int m 月
 * @return object 每一天的数据列表
 */
Calendar.prototype.calendar = function calendar(y, m) {
    var sDObj, lDObj, lY, lM, lD = 1, lL, lX = 0, tmp1, tmp2, lM2, lY2, lD2, tmp3, dayglus, bsg, xs, xs1, fs, fs1, cs, cs1;
    var cY, cM, cD; //年柱,月柱,日柱
    var lDPOS = new Array(3);
    var n = 0;
    var firstLM = 0;
    var _this = {};    // 日历对象

    sDObj = new Date(y, m, 1, 0, 0, 0, 0);    //当月一日日期

    _this.length = this.solarDays(y, m);      //公历当月天数
    _this.firstWeek = sDObj.getDay();    //公历当月1日星期几

    //年柱 1900年立春后为庚子年(60进制36)
    var cyNum;
    if (m < 2) {
        cyNum = y - 1900 + 36 - 1;
    } else {
        cyNum = y - 1900 + 36;
    }
    cY = this.cyclical(cyNum);

    var term2 = this.sTerm(y, 2);            //立春日期

    //月柱 1900年1月小寒以前为 丙子月(60进制12)
    var firstNode = this.sTerm(y, m * 2);     //返回当月「节」为几日开始
    cM = this.cyclical((y - 1900) * 12 + m + 12);

    lM2 = (y - 1900) * 12 + m + 12;

    //当月一日与 1900/1/1 相差天数
    //1900/1/1与 1970/1/1 相差25567日, 1900/1/1 日柱为甲戌日(60进制10)
    var dayCyclical = Date.UTC(y, m, 1, 0, 0, 0, 0) / 86400000 + 25567 + 10;

    for (var i = 0; i < _this.length; i++) {
        // debugger;
        if (lD > lX) {
            sDObj = new Date(y, m, i + 1);      //当月一日日期
            lDObj = this.lunar(sDObj);          //农历对象
            lY = lDObj.year;                    //农历年
            lM = lDObj.month;                   //农历月
            lD = lDObj.day;                     //农历日
            lL = lDObj.isLeap;                  //农历是否闰月
            lX = lL ? this.leapDays(lY) : this.monthDays(lY, lM); //农历当月最后一天

            if (n == 0) {
                firstLM = lM;
            }

            lDPOS[n++] = i - lD + 1;
        }


        //依节气调整二月分的年柱, 以立春为界
        if (m == 1 && (i + 1) == term2) {
            cY = this.cyclical(y - 1900 + 36);
            lY2 = (y - 1900 + 36);
        }
        //依节气月柱, 以「节」为界
        if ((i + 1) == firstNode) {
            cM = this.cyclical((y - 1900) * 12 + m + 13);
            lM2 = (y - 1900) * 12 + m + 13;
        }

        //日柱
        cD = this.cyclical(dayCyclical + i);
        lD2 = (dayCyclical + i);


        //获取日历属性
        _this[i] = this.calElement(y, m + 1, i + 1, calendarInfo.nStr1[(i + _this.firstWeek) % 7], lY, lM, lD++, lL,
            cY, cM, cD);

        // 获取黄历的禁忌
        _this[i].sgz5 = this.calConv2(lY2 % 12, lM2 % 12, (lD2) % 12, lY2 % 10, (lD2) % 10, lM, lD - 1, m + 1, cs1);
        _this[i].sgz3 = this.cyclical6(lM2 % 12, (lD2) % 12);

    }

    //节气
    tmp1 = this.sTerm(y, m * 2) - 1;
    tmp2 = this.sTerm(y, m * 2 + 1) - 1;
    // 二十四节气表
    _this[tmp1].solarTerms = calendarInfo.solarTerm[m * 2];
    _this[tmp2].solarTerms = calendarInfo.solarTerm[m * 2 + 1];
    if (m == 3) _this[tmp1].color = 'red'; //清明颜色

    //国历节日
    for (i in calendarInfo.sFtv) {
        if (common.type(calendarInfo.sFtv[i]) == 'string' && calendarInfo.sFtv[i].match(/^(\d{2})(\d{2})([\s\*])(.+)$/))
            if (Number(RegExp.$1) == (m + 1)) {
                _this[Number(RegExp.$2) - 1].solarFestival += RegExp.$4 + '  ';
                if (RegExp.$3 == '*') {
                    _this[Number(RegExp.$2) - 1].color = 'red';
                }
            }
    }

    //农历节日
    for (i in calendarInfo.lFtv) {
        if (common.type(calendarInfo.lFtv[i]) == 'string' && calendarInfo.lFtv[i].match(/^(\d{2})(.{2})([\s\*])(.+)$/)) {
            tmp1 = Number(RegExp.$1) - firstLM;
            if (tmp1 == -11) {
                tmp1 = 1;
            }
            if (tmp1 >= 0 && tmp1 < n) {
                tmp2 = lDPOS[tmp1] + Number(RegExp.$2) - 1;
                if (tmp2 >= 0 && tmp2 < _this.length) {
                    _this[tmp2].lunarFestival += RegExp.$4 + '  ';
                    if (RegExp.$3 == '*') {
                        _this[tmp2].color = 'red';
                    }
                }
            }
        }
    }

    //营销日
    for (i in this.calendarInfo.yFtv) {
        if (common.type(this.calendarInfo.yFtv[i]) == 'string' && this.calendarInfo.yFtv[i].match(/^(\d{2})(\d{2})([\s\*])(.+)$/))
            if (Number(RegExp.$1) == (m + 1)) {
                _this[Number(RegExp.$2) - 1].yingFestival += RegExp.$4 + '  ';
                if (RegExp.$3 == '*') {
                    _this[Number(RegExp.$2) - 1].color = '#f0f';
                }
            }
    }


    //黑色星期五
    // if ((_this.firstWeek + 12) % 7 == 5) {
    //     _this[12].solarFestival += '黑色星期五';
    // }

    //今日
    if (y == this.today.tY() && m == this.today.tM()) {
        _this[this.today.tD() - 1].isToday = true;
    }

    return _this;
};

/**
 * 画每月的日历
 * @param  int year 年
 * @param  int month 月
 * @param  function funct 操作完后执行的函数
 * @return null
 */
Calendar.prototype.drawCld = function drawCld($elBox, year, month, beforeDrawCldFn, afterDrawCldFn) {
    var i;
    var sD;
    var s;
    var cld;

    if (beforeDrawCldFn) {
        beforeDrawCldFn(this);
    }

    //最大有三个对象
    if (!this.cldObj || this.cldObj.length === 3) {
        this.cldObj = [];
    }

    cld = this.calendar(year, month);

    this.cldObj.push(cld);
    // this.cld = cld;

    for (i = 0; i < 42; i++) {
        // debugger;
        var $curDateItem = $elBox.find('.date-item').eq(i);
        var $solarCalendar = $curDateItem.find('.solar-calendar');
        var $lunarCalendar = $curDateItem.find('.lunar-calendar');

        sD = i - cld.firstWeek;

        if (sD > -1 && sD < cld.length) {  //日期内
            $solarCalendar.text(sD + 1);
            $curDateItem.attr({
                'data-solor': sD + 1,      // 设置阳历日
                'data-month': month + 1,   // 设置阳历月
                'data-year': year          // 设置阳历年
            });

            if (cld[sD].isToday) {      // 今日
                this.todayInfo = cld[sD];
                $curDateItem.addClass("today");          //今日颜色
                $curDateItem.addClass("active");         //选中
                if (this.firstShow === true) {
                    this.firstShow = false;
                    this.showDateDetail($curDateItem);   // 显示右侧黄历
                }

            }

            if (cld[sD].lDay == 1) {  //显示农历月
                $lunarCalendar.html('<b>' + (cld[sD].isLeap ? '闰' : '') + calendarInfo.chineseMonth[cld[sD].lMonth] + '月' + '</b>');
            } else {
                $lunarCalendar.text(this.cDay(cld[sD].lDay));
            }

            s = cld[sD].yingFestival;

            if (s.length > 0) {
                $curDateItem.addClass('marketing-day');
            } else {

                s = cld[sD].lunarFestival;

                //农历节日
                if (s.length > 0) {
                    if (s.length > 8) {
                        s = s.substr(0, 5) + '...';
                    }
                    $curDateItem.addClass('lunar-style');
                }
                //国历节日
                else {
                    s = cld[sD].solarFestival;
                    if (s.length > 0) {
                        if (s.length > 8) {
                            s = s.substr(0, 5) + '...';
                        }
                        s == '黑色星期五' ? $curDateItem.addClass('black-style') : $curDateItem.addClass('solar-style');
                    }
                    //廿四节气
                    else {
                        s = cld[sD].solarTerms;
                        if (s.length > 0)  $curDateItem.addClass('lunar-style');
                        // if (s.length > 0)  s = s.fontcolor('limegreen');
                    }
                }
            }


            if (cld[sD].solarTerms == '清明') {
                s = '清明节'.fontcolor('red');
            }
            if (cld[sD].solarTerms == '芒种') {
                s = '芒种'.fontcolor('red');
            }
            if (cld[sD].solarTerms == '夏至') {
                s = '夏至'.fontcolor('red');
            }
            if (cld[sD].solarTerms == '冬至') {
                s = '冬至'.fontcolor('red');
            }

            if (s.length > 0) {
                $lunarCalendar.html(s);
            }

        }

    }

    //如果存在函数则执行函数
    if (afterDrawCldFn) {
        afterDrawCldFn(this);
    }
};


/**
 * 今日
 */
Calendar.prototype.today = {
    date: new Date(),
    tY: function tY() {
        return this.date.getFullYear()
    },
    tM: function tM() {
        return this.date.getMonth()
    },
    tD: function tD() {
        return this.date.getDate()
    }
};


/**
 * 返回农历 y年的总天数
 * @param  int y 年
 * @return int
 */
Calendar.prototype.lYearDays = function lYearDays(y) {
    var i, sum = 348;
    for (i = 0x8000; i > 0x8; i >>= 1) {
        sum = sum + ((calendarInfo.lunarInfo[y - 1900] & i) ? 1 : 0);
    }
    return sum + this.leapDays(y);
};

/**
 * 返回农历 y年闰月的天数
 * @param  int y 年
 * @return int
 */
Calendar.prototype.leapDays = function leapDays(y) {
    if (this.leapMonth(y)) {
        return (calendarInfo.lunarInfo[y - 1899] & 0xf) == 0xf ? 30 : 29;
    }
    else {
        return 0;
    }
};

/**
 * 返回农历 y年闰哪个月 1-12 , 没闰返回 0
 * @param  int y 年
 * @return int
 */

Calendar.prototype.leapMonth = function leapMonth(y) {
    var lm = calendarInfo.lunarInfo[y - 1900] & 0xf;
    return lm == 0xf ? 0 : lm;
};

/**
 * 农历 y年m月的总天数
 * @param  int y 年
 * @param  imt m 月
 * @return int y年m月的总天数
 */
Calendar.prototype.monthDays = function monthDays(y, m) {
    return (calendarInfo.lunarInfo[y - 1900] & (0x10000 >> m)) ? 30 : 29;
};

/**
 * 算出农历, 传入日期控件, 返回农历日期控件
 * 该控件属性有 .year .month .day .isLeap
 */
Calendar.prototype.lunar = function lunar(objDate) {
    var i, leap, temp = 0, _this = {};
    var offset = (Date.UTC(objDate.getFullYear(), objDate.getMonth(), objDate.getDate()) - Date.UTC(1900, 0, 31)) / 86400000;

    for (i = 1900; i < 2100 && offset > 0; i++) {
        temp = this.lYearDays(i);
        offset = offset - temp;
    }

    if (offset < 0) {
        offset = offset + temp;
        i = i - 1;
    }

    _this.year = i;

    leap = this.leapMonth(i); //闰哪个月
    _this.isLeap = false;

    for (i = 1; i < 13 && offset > 0; i++) {
        //闰月
        if (leap > 0 && i == (leap + 1) && _this.isLeap == false) {
            i = i - 1;
            _this.isLeap = true;
            temp = this.leapDays(_this.year);
        }
        else {
            temp = this.monthDays(_this.year, i);
        }

        //解除闰月
        if (_this.isLeap == true && i == (leap + 1)) {
            _this.isLeap = false;
        }

        offset = offset - temp;
    }

    if (offset == 0 && leap > 0 && i == leap + 1)
        if (_this.isLeap) {
            _this.isLeap = false;
        }
        else {
            _this.isLeap = true;
            i = i - 1;
        }

    if (offset < 0) {
        offset = offset + temp;
        i = i - 1;
    }

    _this.month = i;
    _this.day = offset + 1;
    return _this;
};


/**
 * 将日期格式化中文日期
 * @param  int m 月
 * @return string
 */
Calendar.prototype.cDay = function cDay(d) {
    var s;
    switch (d) {
        case  10:
            s = '初十';
            break;
        case  20:
            s = '二十';
            break;
        case  30:
            s = '三十';
            break;
        default  :
            s = calendarInfo.nStr2[Math.floor(d / 10)];
            s = s + calendarInfo.nStr1[d % 10];
    }
    return s;
};


/**
 * 将农历iLunarMonth月格式化成农历表示的字符串
 * @param  int  iLunarMonth 月份
 * @return string
 */
Calendar.prototype.formatLunarMonth = function formatLunarMonth(iLunarMonth) {
    var szText = "正二三四五六七八九十";
    var strMonth;
    if (iLunarMonth <= 10) {
        strMonth = szText.substr(iLunarMonth - 1, 1);
    } else if (iLunarMonth == 11) {
        strMonth = "十一";
    } else {
        strMonth = "十二";
    }
    return strMonth + "月";
};

/**
 * 将农历iLunarDay日格式化成农历表示的字符串
 * @param  int iLunarDay 日
 * @return string
 */
Calendar.prototype.formatLunarDay = function formatLunarDay(iLunarDay) {
    var szText1 = "初十廿三";
    var szText2 = "一二三四五六七八九十";
    var strDay;
    if ((iLunarDay != 20) && (iLunarDay != 30)) {
        strDay = szText1.substr((iLunarDay - 1) / 10, 1) + szText2.substr((iLunarDay - 1) % 10, 1);
    } else if (iLunarDay != 20) {
        strDay = szText1.substr(iLunarDay / 10, 1) + "十";
    } else {
        strDay = "二十";
    }
    return strDay;
};


/**
 * 显示详细日期资料
 * @param  $el
 * @return null
 */
Calendar.prototype.showDateDetail = function showDateDetail($el){
    if ($el.attr('data-solor')) {
        var d = $el.attr('data-solor') - 1;   // 阳历天
        var curCld = this.cldObj[1];

        var currentYear = curCld[d].sYear;
        var currentMonth = curCld[d].sMonth;
        var currentDay = curCld[d].sDay;
        if (String(currentMonth).length === 1) {
            currentMonth = '0' + currentMonth;
        }
        if (String(currentDay).length === 1) {
            currentDay = '0' + currentDay;
        }

        // 显示年月日
        this.$date_info.find('.current-date').text(currentYear + '.' + currentMonth + '.' + currentDay);

        // 显示星期
        this.$date_info.find('.current-weekday').text('星期' + curCld[d].week);

        // 显示农历
        this.$date_info.find('.current-lunar').text((curCld[d].isLeap ? '闰' : ' ') + this.formatLunarMonth(curCld[d].lMonth) + this.formatLunarDay(curCld[d].lDay));
    }
};


/**
 * 返回公历 y年某m+1月的天数
 */
Calendar.prototype.solarDays = function solarDays(y, m) {
    if (m == 1) {
        return ((y % 4 == 0) && (y % 100 != 0) || (y % 400 == 0)) ? 29 : 28;
    } else {
        return calendarInfo.solarMonth[m];
    }
};

/**
 * 传入 offset 返回干支, 0=甲子
 */
Calendar.prototype.cyclical = function cyclical(num) {
    return calendarInfo.gan[num % 10] + calendarInfo.zhi[num % 12];
};


/**
 * 日历属性
 *
 * @param  int sYear  公元年4位数字
 * @param  int sMonth 公元月数字
 * @param  int sDay   公元日数字
 * @param  string  week   星期, 1个中文
 * @param  int  lYear  公元年4位数字
 * @param  int  lMonth 农历月数字
 * @param  int  lDay   农历日数字
 * @param  bool isLeap 是否为农历闰月
 * @param  string  cYear  年柱, 2个中文
 * @param  string  cMonth 月柱, 2个中文
 * @param  string  cDay   日柱, 2个中文
 * @return object
 */

Calendar.prototype.calElement = function calElement(sYear, sMonth, sDay, week, lYear, lMonth, lDay, isLeap, cYear, cMonth, cDay) {
    return {
        isToday: false,
        //公历
        sYear: sYear,        //公元年4位数字
        sMonth: sMonth,      //公元月数字
        sDay: sDay,          //公元日数字
        week: week,          //星期, 1个中文
        //农历
        lYear: lYear,        //公元年4位数字
        lMonth: lMonth,      //农历月数字
        lDay: lDay,          //农历日数字
        isLeap: isLeap,      //是否为农历闰月?
        //八字
        cYear: cYear,        //年柱, 2个中文
        cMonth: cMonth,      //月柱, 2个中文
        cDay: cDay,          //日柱, 2个中文

        color: '',

        lunarFestival: '',   //农历节日
        solarFestival: '',   //公历节日
        yingFestival: '',    //营销日
        solarTerms: ''       //节气
    }
};

/**
 * 某年的第n个节气为几日(从0小寒起算)
 * @param  int y 年
 * @param  int n 月
 * @return date
 */
Calendar.prototype.sTerm = function sTerm(y, n) {
    var offDate = new Date(( 31556925974.7 * (y - 1900) + calendarInfo.sTermInfo[n] * 60000  ) + Date.UTC(1900, 0, 6, 2, 5));
    return offDate.getUTCDate(); // 返回月中的一天
};

/**
 * 返回阴历 (y年,m+1月)
 */
Calendar.prototype.cyclical6 = function cyclical6(num, num2) {
    if (num == 0) {
        return calendarInfo.jcName0[num2];
    }
    if (num == 1) {
        return calendarInfo.jcName1[num2];
    }
    if (num == 2) {
        return calendarInfo.jcName2[num2];
    }
    if (num == 3) {
        return calendarInfo.jcName3[num2];
    }
    if (num == 4) {
        return calendarInfo.jcName4[num2];
    }
    if (num == 5) {
        return calendarInfo.jcName5[num2];
    }
    if (num == 6) {
        return calendarInfo.jcName6[num2];
    }
    if (num == 7) {
        return calendarInfo.jcName7[num2];
    }
    if (num == 8) {
        return calendarInfo.jcName8[num2];
    }
    if (num == 9) {
        return calendarInfo.jcName9[num2];
    }
    if (num == 10) {
        return calendarInfo.jcName10[num2];
    }
    if (num == 11) {
        return calendarInfo.jcName11[num2];
    }
};

//黄历禁忌
Calendar.prototype.calConv2 = function calConv2(yy, mm, dd, y, d, m, dt, nm, nd) {
    var dy = d + '' + dd;
    if ((yy == 0 && dd == 6) || (yy == 6 && dd == 0) || (yy == 1 && dd == 7) || (yy == 7 && dd == 1) || (yy == 2 && dd == 8) || (yy == 8 && dd == 2) || (yy == 3 && dd == 9) || (yy == 9 && dd == 3) || (yy == 4 && dd == 10) || (yy == 10 && dd == 4) || (yy == 5 && dd == 11) || (yy == 11 && dd == 5)) {
        return {'ban': ['日值岁破', '大事不宜']};
    }
    else if ((mm == 0 && dd == 6) || (mm == 6 && dd == 0) || (mm == 1 && dd == 7) || (mm == 7 && dd == 1) || (mm == 2 && dd == 8) || (mm == 8 && dd == 2) || (mm == 3 && dd == 9) || (mm == 9 && dd == 3) || (mm == 4 && dd == 10) || (mm == 10 && dd == 4) || (mm == 5 && dd == 11) || (mm == 11 && dd == 5)) {
        return {'ban': ['日值月破', '大事不宜']};
    }
    else if ((y == 0 && dy == '911') || (y == 1 && dy == '55') || (y == 2 && dy == '111') || (y == 3 && dy == '75') || (y == 4 && dy == '311') || (y == 5 && dy == '95') || (y == 6 && dy == '511') || (y == 7 && dy == '15') || (y == 8 && dy == '711') || (y == 9 && dy == '35')) {
        return {'ban': ['日值上朔', '大事不宜']};
    }
    else if ((m == 1 && dt == 13) || (m == 2 && dt == 11) || (m == 3 && dt == 9) || (m == 4 && dt == 7) || (m == 5 && dt == 5) || (m == 6 && dt == 3) || (m == 7 && dt == 1) || (m == 7 && dt == 29) || (m == 8 && dt == 27) || (m == 9 && dt == 25) || (m == 10 && dt == 23) || (m == 11 && dt == 21) || (m == 12 && dt == 19)) {
        return {'ban': ['日值杨公十三忌', '大事不宜']};
    }
    else {
        return 0;
    }
};

module.exports = Calendar;
// window.Calendar = Calendar;
