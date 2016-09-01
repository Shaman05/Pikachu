/**
 * Created by ChenChao on 2016/8/31.
 */

"use strict";

var fs = require('fs');
var electron = require('electron');
var remote = electron.remote;
var mainWindow = remote.getCurrentWindow();
var util = require('../../core/util');
var config = require('../../config');

var V = new Vue({
    el: '#app',
    data: {
        pageLoad: false,
        contentShow: 'compass',
        rubyVersion: '正在获取当前 ruby 版本号...',
        sassVersion: '正在获取当前 sass 版本号...',
        compassVersion: '正在获取当前 compass 版本号...'
    },
    created: function(){
        var _this = this;
        this.pageLoad = true;
        mainWindow.show();
        util.getRubyVersion(function (msg) {
            _this.rubyVersion = msg;
        });
        util.getSassVersion(function (msg) {
            _this.sassVersion = msg;
        });
        util.getCompassVersion(function (msg) {
            _this.compassVersion = msg;
        });
    },
    methods: {
        closeWin: mainWindow.close,
        refreshWin: function () {
            mainWindow.reload();
        },
        tabSetting: function (contentName) {
            this.contentShow = contentName;
        }
    }
});