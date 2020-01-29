# Daily Ledger 数据处理工具

## 介绍

将原始数据格式（易于快速记录时间）转换为`JSON`格式，用于前端的数据获取。

1. 原始数据格式

第一行为当天日期，格式为`YYYY-MM-DD`

从第二行起，为每一时段发生的事情（类型，也可以补充详情），格式为`HH.mm type detail`

```
2020-01-09
1.00 聊天
7.40 晚睡
9.20 奔波 从宿舍到实验室
9.40 吃饭
...
...
...
12.00 前端 学习typescript语法
```

2. `JSON`格式

```json
[
  {
    "startOClock":"2020-01-08T16:00:00.000Z",
    "endOClock":"2020-01-08T17:00:00.000Z",
    "duration":1,
    "type":"聊天"
  },
  {
    "startOClock":"2020-01-08T17:00:00.000Z",
    "endOClock":"2020-01-08T23:40:00.000Z",
    "duration":6.666666666666667,
    "type":"晚睡",
    "detail":""
  },
  {
    "startOClock":"2020-01-08T23:40:00.000Z",
    "endOClock":"2020-01-09T01:20:00.000Z",
    "duration":1.6666666666666667,
    "type":"奔波",
    "detail":"从宿舍到实验室"
  },
  {
    "startOClock":"2020-01-09T01:20:00.000Z",
    "endOClock":"2020-01-09T01:40:00.000Z",
    "duration":0.3333333333333333,
    "type":"吃饭",
    "detail":""
  },
  ...
  ...
  ...
]
```

## 使用

> 注：使用时，为了该工具正确处理文件路径`/data`，需要将`daily-ledger-tool`和`daily-ledger-frontend`两个项目放置在同一路径下。

1. `yarn start`，编译源文件。
2. 编辑`./data/today.txt`，按照上述原始格式，添加当天的内容。
3. `node ./dist/daily-ledger-data-tool.umd.js`，执行文件。
