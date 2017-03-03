$(document).ready(function() {
  var chart = echarts.init(document.getElementById('main'));
  // rem
  adapt(640,100);
  function  adapt(designWidth, rem2px) {
      var div = document.createElement('div');
      var head = document.querySelector('head');
      var winHeight = window.innerHeight;
      var winWidth = window.innerWidth;
      div.style.width = '1rem';
      div.style.display = "none";
      head.appendChild(div);
      var defaultFontSize = parseFloat(window.getComputedStyle(div, null).getPropertyValue('width'));
      div.remove();
      var style = document.createElement('style');
      var portrait = "@media screen and (min-width: " + winWidth + "px) {html{font-size:" + ((winWidth / (designWidth / rem2px) / defaultFontSize) * 100) + "%;}}";
      var landscape = "@media screen and (min-width: " + winHeight + "px) {html{font-size:" + ((winHeight / (designWidth / rem2px) / defaultFontSize) * 100) + "%;}}"
      style.innerHTML = portrait + landscape;
      head.appendChild(style);
      return defaultFontSize;
    }
    // 获取数据
    var hotWordslist = [];
    function getData(){
      $.ajax({
        url: 'http://mrm.amediaz.cn/calendar',
        type: 'GET',
        dataType: 'json',
        data: {currentDate: '2017-11-7'},
        success:function(response) {
            debugger;
          var keyWord = "";
          var hotWords = "";
          // 词云
          hotWordslist = response.data.wordClouds;
          var option = {
              tooltip: {},
              series: [ {
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
                  data:hotWordslist
              } ]
          };
          chart.setOption(option);
          window.onresize = chart.resize;
          // 去年关键词
          var word = response.data.wordClouds;
            debugger;
          keyWord = word[0].name+" "+word[1].name+" "+word[2].name;
          hotWords = word[0].name+"("+word[0].value+") "+word[1].name+"("+word[1].value+") "+word[2].name+"("+word[2].value+") ";
          $(".key-word").text(keyWord);
          $(".hot-words").text(hotWords);

          $(".artile-title").text(response.data.artilecontent.artileTile || '今日');
          // 去年热文
          // saleCase
          $(".hot-article").html("");
          $(".yxDemo").html("");
          response.data.lastYearArtiles.forEach(function(article){
            $(".hot-article").append('<li><p class="article-title">@'+article.accountName+'：<a href="'+article.artileURL+'">'+article.artitleTitle+'</a></p><div class="article-msg"><span>阅读 <span>'+ article.readNum +'&nbsp&nbsp</span></span><span> <i class="fa fa-thumbs-o-up"></i>'+ article.likeNum +'</span></div></li>')
          });
          response.data.saleCases.forEach(function(article){
            $(".yxDemo").append('<li><p class="article-title">@'+article.accountName+'：<a href="'+article.artileURL+'">'+article.artitleTitle+'</a></p><div class="article-msg"><span>阅读 <span>'+ article.readNum +'&nbsp&nbsp</span></span><span> <i class="fa fa-thumbs-o-up"></i>'+ article.likeNum +'</span></div></li>')
          });
        },
        error:function(msg){
            alert("我也不知道发生了什么...T T")              //执行错误
        }
      });

      // $.get("list.json", function(response) {
      //   var keyWord = "";
      //   var hotWords = "";
      //   // 词云
      //   hotWordslist = response.data.wordCloud;
      //   var option = {
      //       tooltip: {},
      //       series: [ {
      //           type: 'wordCloud',
      //           gridSize: 2,
      //           sizeRange: [12, 50],
      //           rotationRange: [-90, 90],
      //           shape: 'pentagon',
      //           width: 600,
      //           height: 400,
      //           textStyle: {
      //               normal: {
      //                   color: function () {
      //                       return 'rgb(' + [
      //                           Math.round(Math.random() * 160),
      //                           Math.round(Math.random() * 160),
      //                           Math.round(Math.random() * 160)
      //                       ].join(',') + ')';
      //                   }
      //               },
      //               emphasis: {
      //                   shadowBlur: 10,
      //                   shadowColor: '#333'
      //               }
      //           },
      //           data:hotWordslist
      //       } ]
      //   };
      //   chart.setOption(option);
      //   window.onresize = chart.resize;
      //   // 去年关键词
      //   var word = response.data.wordCloud;
      //   keyWord = word[0].name+" "+word[1].name+" "+word[2].name;
      //   hotWords = word[0].name+"("+word[0].value+") "+word[1].name+"("+word[1].value+") "+word[2].name+"("+word[2].value+") ";
      //   $(".key-word").text(keyWord);
      //   $(".hot-words").text(hotWords);
      //   // 去年热文
      //   // saleCase
      //   $(".hot-article").html("");
      //   $(".yxDemo").html("");
      //   response.data.lastYearArtile.forEach(function(article){
      //     $(".hot-article").append('<li><p class="article-title">@'+article.artitleTitle+'<a href=""></a></p><div class="article-msg"><span>阅读 <span>'+ article.readNum +'&nbsp&nbsp</span></span><span> <i class="fa fa-thumbs-o-up"></i>'+ article.likeNum +'</span></div></li>')
      //   });
      //   response.data.saleCase.forEach(function(article){
      //     $(".yxDemo").append('<li><p class="article-title">@'+article.artitleTitle+'<a href=""></a></p><div class="article-msg"><span>阅读 <span>'+ article.readNum +'&nbsp&nbsp</span></span><span> <i class="fa fa-thumbs-o-up"></i>'+ article.likeNum +'</span></div></li>')
      //   });
      // });
    }
  getData();
  $("#id_almanac").almanac({
    /**
     * 画日历之后调用函数
     */
    afterDrawCld: function(year, month){
      // console.log('加载-调用回调函数 完成');
    },
    /**
     * 单击某一天的事件
     */
    clickDay: function(elem){
      var _this = $(elem);
      _this.addClass('select').siblings().removeClass('select');
      var _date = "";
      if(_this.hasClass('unover')){

      }else{
        $("#right").scrollTop(2);
        _date = _this.attr('data-year') +"-"+ _this.attr('data-month') +"-"+ _this.attr('data-solor');
        console.log(_date);
        getData();
      }
    }
  });
});