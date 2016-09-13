/**
 * Created by ChenChao on 2016/7/19.
 */

"use strict";

var fs = require('fs');
var electron = require('electron');
var remote = electron.remote;
var mainWindow = remote.getCurrentWindow();
var util = require('../../../core/util');

module.exports = function (config) {
    var V = new Vue({
        el: '#app',
        data: {
            appLoading: true,
            logFile: config.logFile,
            content: '',
            isFullScreen: false
        },
        created: function(){
            this.appLoading = false;
            this.readFileContent();
            setTimeout(function () {
                mainWindow.show();
            }, 100);
        },
        methods: {
            closeWin: mainWindow.close,
            reloadWin: function(){
                mainWindow.reload();
                /*var _this = this;
                 _this.appLoading = true;
                 _this.content = '';
                 setTimeout(function(){
                 _this.readFileContent();
                 _this.appLoading = false;
                 }, 350);*/
            },
            readFileContent: function (){
                var _this = this;
                var liner = util.getLiner();
                var source = fs.createReadStream(config.logFile);
                source.pipe(liner);
                liner.on('readable', function(){
                    var line;
                    while (line = liner.read()) {
                        _this.content += line.replace(/\r|\n/ig, '') ? `<p>${line}</p>` : '<div class="blank"></div>';
                    }
                });
            }
        }
    });

    //todo 需要解决刷新后窗口切换最大化报错的问题
    mainWindow.on('resize', function (e) {
        V.isFullScreen = mainWindow.isMaximized();
    });

    return V;
};