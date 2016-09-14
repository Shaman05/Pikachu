/**
 * Created by ChenChao on 2016/8/4.
 */

"use strict";

var util = require('util');
var fs = require('fs');
var path = require('path');
var _util = require('./util');
var compass = require('./compass');
var mr = Math.random;
var readdir = fs.readdir;
var stat = fs.stat;
var join = path.join;
var ignoreDirName = ['node_modules', '.idea', '.git', 'www', 'public'];

module.exports = {
    scanFile: function (dir, callback) {
        var result = [];
        var timer = null;
        var randomValue = mr().toString(36);
        var lastValue = randomValue;
        timer = setInterval(function () {
            if(lastValue === randomValue){
                clearInterval(timer);
                callback && callback(result.sort(sortRule));
            }else{
                lastValue = randomValue;
            }
        }, 70); //70ms已经是极限了
        readDir(dir);
        function readDir(dir) {
            readdir(dir, function (err, files) {
                files.forEach(function (item, i) {
                    var itemPath = join(dir, item);
                    stat(itemPath, function (err, stats) {
                        randomValue = mr().toString(36);
                        if(stats.isFile() && isSassFile(item)){
                            result.push({
                                name: item,
                                path: dir,
                                fullPath: itemPath,
                                size: stats.size,
                                birthTime: stats.birthtime,
                                mTime: stats.mtime
                            });
                        }
                        if(stats.isDirectory() && ignoreDirName.indexOf(item) < 0){
                            readDir(itemPath);
                        }
                    });
                });
            });
        }
    },

    /**
     * sass 编译
     * @param file sass源文件对象
     * @param compileType 编译方式：sass|compass
     */
    compile: function (file, compileType) {
        var compileOptions = _util.getSassCompileOptions(file);
        var fileName = file.name;
        var cssFilePath = `${file.cssDir}\\${fileName.replace('.scss', '.css')}`;
        _util.consoleTask('编译 scss 文件', fileName);
        if(compileType == 'sass'){
            compileOptions.cssFile = cssFilePath;
        }
        compass[compileType == 'sass' ? 'sassCompile' : 'compassCompile'](file.fullPath, compileOptions, function (code, duration, error) {
            if(code == 0){
                _util.tip(`完成编译！耗时：${duration}ms`);
                _util.consoleInfo(`完成编译！耗时：${duration}ms`);
            }else{
                _util.tipError(`编译异常，详情查看控制台！`);
                _util.consoleError(error);
            }
        });
    }
};

function isSassFile(fileName) {
    return fileName.split('.').pop() === 'scss';
    //return /\.scss$/.test(fileName); //正则还要稍微慢些
}

function sortRule(a, b) {
    if(a.name > b.name){
        return 1;
    }
    if(a.name < b.name){
        return -1;
    }
    return 0;
}