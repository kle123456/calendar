
���ݶ���˵����
- "result": 1, // 1-�ɹ���0-ʧ�� 
- "code": 200, 
- "message": "�ɹ�", 
- data.calendars // ȫ������������
- data.artilecontent // �������ڵ�����
- data.lastYearArtile // ȥ������
- data.wordCloud // ����
- data.saleCase // Ӫ������

���ʽӿڣ�
{url}: http://mrm.amediaz.cn

���Ϸ��ʽӿڣ�{url}/calendar

http://mrm.amediaz.cn/calendar?currentDate=2016-11-19

������
ʱ�䣺currentDate: 
�磺 "2016-11-12"


```
{
    "result": 1,
    "code": 200,
    "message": "�ɹ�",
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
                "artileTile": "����������",
                "calendarDateTime": "2017-01-18",
                "eventDateTime": "2017-01-31"
            }
        ],
        "artilecontent": {
            "result": 1,
            "artileTile": "����������",
            "calendarDateTime": "2017-01-18",
            "eventDateTime": "2017-01-31",
            "calendarContent": "�ȶ��������ʩ",
            "expectContent": "�ȶ��������ʩ"
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
                "text": "���",
                "weight": 44
            },
            {
                "text": "����",
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

ʧ�ܣ�

```
{"result":0,"code":1001,"message":"ʧ��,��������ȷ�Ĳ���"}
```