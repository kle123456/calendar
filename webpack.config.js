/**
 * Created by chenxingyu on 2017/1/19.
 */
var webpack = require('webpack');
var path = require('path');

var config = {
    //入口文件配置
    entry:path.resolve(__dirname,'src/js/main.js'),
    watch : true,
    //文件导出的配置
    output:{
        path: path.resolve(__dirname,"dist/js"),
        filename:"app.js"
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
        ]
    },
    //插件
    plugins: [
        new webpack.optimize.DedupePlugin(), 　//检测相似的文件，或者文件中重复的内容 ， 然后消除掉
        new webpack.NoErrorsPlugin(),  ////保证编译过程不会出错
    ]
};

module.exports = config;