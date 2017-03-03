calendar H5运营日历
=====================

## 项目运行

1)安装Node.js
请确保安装了Node.js https://nodejs.org/en/ 安装For Most Users 版本
打开终端：
输入：
npm -v & node -v
输出：
3.10.8
v6.9.1

2)安装gulp
输入命令：
npm install gulp -g  

3)安装NodeJS 插件http-server
npm install http-server -g


到项目的根目录下：
``` bash
cd path/calendar
npm install

完成后，输入命令:
gulp build

构建完毕：
在项目的更目录下执行：
http-server 

打开localhost:8080 
或 在电脑开启360wifi，手机观看。
ip:8080 查看


# 开发环境
gulp 或者 gulp watch

# 打包环境
gulp build
```

src 是开发目录 ， dist是打包目录

运行结果：
![image](/doc/img/Screenshot_2017-03-04-02-27-43-664_com.tencent.mo.png)


