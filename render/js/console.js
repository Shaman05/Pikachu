/**
 * Created by ChenChao on 2016/7/19.
 */

"use strict";

var fs = require('fs');
var electron = require('electron');
var remote = electron.remote;
var mainWindow = remote.getCurrentWindow();
var util = require('../../core/util');
var consoleMenu = require('./consolemenu');

module.exports = function (config) {
    var appConf = config.appInfo;
    return new Vue({
        el: '#app',
        data: {
            content: '',
            versionConsole: '',
            fontSize: 13
        },
        created: function(){
            var _this = this;
            this.versionConsole = `© 2016 ${appConf.title} version${appConf.version} [${config.osType} - ${config.osPlatform}]`;
            setTimeout(function () {
                _this.printMsg('Console is ready !', 'normal');
            }, 500);
            mainWindow.show();
        },
        methods: {
            closeWin: mainWindow.close,
            popMenu: function (e) {
                consoleMenu.popup(remote.getCurrentWindow());
            },
            printMsg: function (msg, type) {
                var wrap = document.getElementById('consoleWrap');
                this.content += '<p class="console-' + type + '">' + decodeURIComponent(msg) + '</p>';
                setTimeout(function () {
                    wrap.scrollTop = wrap.scrollHeight;
                }, 10);
            },
            setFontSize: function (fontSize) {
                this.fontSize = fontSize;    
            },
            clear: function () {
                this.content = "";
            }
        }
    });
};