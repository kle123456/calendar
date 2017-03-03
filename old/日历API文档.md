
数据对象说明：
- "result": 1, // 1-成功，0-失败 
- "code": 200, 
- "message": "成功", 
- data.calendars // 全部的日历数据
- data.artilecontent // 当天日期的文章
- data.lastYearArtile // 去年热文
- data.wordCloud // 词云
- data.saleCase // 营销案例

访问接口：
{url}: http://mrm.amediaz.cn

线上访问接口：{url}/calendar

http://mrm.amediaz.cn/calendar?currentDate=2016-11-19

参数：
时间：currentDate: 
如： "2016-11-12"


```
{
    "result": 1,
    "code": 200,
    "message": "成功",
    "data": {
        "calendars": [
            {
                "result": 1,
                "artileTile": "7777",
                "calendarDateTime": "2017-01-05",
                "eventDateTime": "2016-01-05"
            },
            {
                "result": 1,
                "artileTile": "藏族自治州",
                "calendarDateTime": "2017-01-18",
                "eventDateTime": "2017-01-31"
            }
        ],
        "artilecontent": {
            "result": 1,
            "artileTile": "藏族自治州",
            "calendarDateTime": "2017-01-18",
            "eventDateTime": "2017-01-31",
            "calendarContent": "等多个公共设施",
            "expectContent": "等多个公共设施"
        },
        "lastYearArtiles": [
            {
                "accountName": "2",
                "artitleTitle": "12",
                "readNum": 11,
                "likeNum": 0,
                "artileURL": "https://www.baidu.com/?tn=93912046_hao_pg"
            },
            {
                "accountName": "5",
                "artitleTitle": "5",
                "readNum": 5,
                "likeNum": 0,
                "artileURL": "https://www.baidu.com/?tn=93912046_hao_pg"
            }
        ],
        "wordClouds": [
            {
                "text": "你好",
                "weight": 44
            },
            {
                "text": "世界",
                "weight": 32
            }
        ],
        "saleCases": [
            {
                "accountName": "2",
                "artitleTitle": "12",
                "readNum": 11,
                "likeNum": 0,
                "artileURL": "https://www.baidu.com/?tn=93912046_hao_pg"
            },
            {
                "accountName": "5",
                "artitleTitle": "5",
                "readNum": 5,
                "likeNum": 0,
                "artileURL": "https://www.baidu.com/?tn=93912046_hao_pg"
            }
        ]
    }
}
```

失败：

```
{"result":0,"code":1001,"message":"失败,请输入正确的参数"}
```