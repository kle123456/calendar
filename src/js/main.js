/**
 * Created by chenxingyu on 2017/1/23.
 */

//引入模块

//解决click 300ms延迟
import FastClick from './core/fastclick';
new FastClick(document.body);

import $ from './core/zepto';
import Calendar from './core/calendar';
import common from './core/common';
import config from './core/config';


//获取DOM
var $body = $('body');
// var $app_wrap = $body.find('.app-wrap');
// var $date_box = $app_wrap.find('.date-box');

var $date_info = $body.find('.date-info');

//关键词
var $key_words_box = $date_info.find('.key-words-box');
var $key_words = $key_words_box.find('.key-words');
//热词
var $hot_words_box = $date_info.find('.hot-words-box');
var $hot_words = $hot_words_box.find('.hot-words');

//去年文章
var $last_year_box = $date_info.find('.last-year-box');
var $last_year_tit = $last_year_box.find('.last-year-tit');
var $article_content = $last_year_box.find('.article-content');

//预测
var $predictive_box = $date_info.find('.predictive-box');
var $article_class = $last_year_box.find('.article-class');

//热文
var $article_box = $date_info.find('.article-box');
var $article_list = $article_box.find('.article-list');

//营销案例
var $marketing_case_box = $date_info.find('.marketing-case-box');
var $marketing_case = $marketing_case_box.find('.marketing-case');


//日历数据对象
var dateInfoObj = {
    // 词云
    wordCloud : function wordCloud(hotWords) {
        var chart = echarts.init($date_info.find('.hot-words-map')[0]);
        var option = {
            tooltip: {},
            series: [{
                type: 'wordCloud',
                gridSize: 2,
                sizeRange: [12, 50],
                rotationRange: [-90, 90],
                shape: 'pentagon',
                width: 600,
                height: 400,
                textStyle: {
                    normal: {
                        color: function () {
                            return 'rgb(' + [
                                    Math.round(Math.random() * 160),
                                    Math.round(Math.random() * 160),
                                    Math.round(Math.random() * 160)
                                ].join(',') + ')';
                        }
                    },
                    emphasis: {
                        shadowBlur: 10,
                        shadowColor: '#333'
                    }
                },
                data: hotWords
            }]
        };

        chart.setOption(option);
    },
    //显示日历数据
    dateInfoShow : function dateInfoShow(data) {
        var wordClouds = data.wordClouds;
        var lastYearArticles = data.lastYearArtiles;
        var articleContent = data.artilecontent;
        var saleCases = data.saleCases;
        var tplArticle = function tplArticle(arr){
            var articleHtml = '';
            arr.forEach(function (item) {
                articleHtml = articleHtml +
                    '<li>' +
                    '<p class="article-title">@' + item.accountName + ' : <a href="' + item.artileURL + '">' + item.artitleTitle + '</a></p>' +
                    '<div class="article-msg">' +
                    '<span><i class="icon-read"></i> <span>' + item.readNum + '&nbsp&nbsp</span></span>' +
                    '<span><i class="icon-thumbs-up"></i> ' + item.likeNum + '</span>' +
                    '</div>' +
                    '</li>';
            });

            return articleHtml;
        };

        //关键词 热词
        if (wordClouds !== undefined) {
            var keyWordsObj = wordClouds.slice(0, 3);
            var keyWord = [];
            var hotWord = [];
            keyWordsObj.forEach(function (item, index) {
                keyWord.push(item.name);
                hotWord.push(item.name + '(<span class="num">' + item.value + '</span>)');
            });

            //显示渲染
            $key_words.text(keyWord.join(' '));
            $hot_words.html(hotWord.join(' '));
            $key_words_box.show();
            $hot_words_box.show();

            //显示词云
            this.wordCloud(wordClouds);

        } else {
            $key_words_box.hide();
            $hot_words_box.hide();
        }

        //去年
        if (articleContent !== undefined) {
            $last_year_tit.text(articleContent.artileTile || '今日');
            $article_content.text(articleContent.calendarContent);
            $last_year_box.show();

            //预测今年
            if (articleContent.expectContent !== undefined) {
                $article_class.text(articleContent.expectContent);
                $predictive_box.show();
            } else {
                $predictive_box.hide();
            }

        } else {
            $last_year_box.hide();
        }

        //去年热文
        if (lastYearArticles !== undefined) {
            //显示渲染
            $article_list.html(tplArticle(lastYearArticles));
            $article_box.show();
        } else {
            //隐藏
            $article_box.hide();
        }

        //营销案例
        if (saleCases !== undefined) {
            //显示渲染
            $marketing_case.html(tplArticle(saleCases));
            $marketing_case_box.show();
        } else {
            //隐藏
            $marketing_case_box.hide();
        }

    }
};


//实例化日历
var calendar = new Calendar({
    //日历初始化回调
    calendarInit: function (obj, initCallback) {
        var options = obj.options;
        var _data = {
            currentDate: options.currYear + '-' + (options.currMonth + 1) + '-' + options.currDay
            // currentDate: '2017-11-7'
        };
        var _success = function _success(res) {

            common.loadHide();

            if (res.code === 200) {
                var calendars = res.data.calendars;
                calendars.forEach(function (item, index) {
                    var dateArr = item.calendarDateTime.split("-");
                    obj.calendarInfo.yFtv.push(dateArr[1] + dateArr[2] + "  " + item.artileTile);
                });

                //回调函数
                initCallback && initCallback();

                //日历信息显示
                dateInfoObj.dateInfoShow(res.data);

                //显示页面内容
                var styleShow = {
                    'visibility' : 'visible'
                };
                // $date_box.css(styleShow);
                $date_info.css(styleShow);

            } else {
                alert('请求失败');
            }

        };

        //获取数据
        common.getData({
            url : config.getCalendar,
            data: _data,
            success: _success,
        });
    },
    //点击每一个日历回调函数
    clickDay: function (obj) {
        //显示loading
        common.loadShow();
        var options = obj.options;
        var _data = {
            currentDate: options.currYear + '-' + options.currMonth + '-' + options.currDay
        };
        var _success = function _success(res) {
            //隐藏loading
            common.loadHide();

            if (res.code === 200) {
                //日历信息显示
                dateInfoObj.dateInfoShow(res.data);
            } else {
                alert('请求失败');
            }

        };

        //获取数据
        common.getData({
            url : config.getCalendar,
            data: _data,
            success: _success,
        });

    }
});


