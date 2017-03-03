/**
 * Created by chenxingyu on 2017/2/7.
 */
const gulp = require('gulp');
const named = require('vinyl-named');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
let webpackConfig = require("./webpack.config");

//监听js处理
gulp.task("webpackDev",function(){
    return gulp.src("./src/main.js")
        .pipe(named())
        .pipe(webpackStream(webpackConfig))
        .pipe(gulp.dest("./dist/js"));
});

//打包js
gulp.task("webpackBuild",function(){
    //添加压缩js代码
    webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin());

    return gulp.src("./src/main.js")
        .pipe(named())
        .pipe(webpackStream(webpackConfig))
        .pipe(gulp.dest("./dist/js"));
});

gulp.task('watch', function() {
    gulp.watch("./src/js/**/*",['webpackDev']);
});

gulp.task('build', ['webpackBuild'], function() {});

gulp.task('default', ['watch', 'webpackDev']);