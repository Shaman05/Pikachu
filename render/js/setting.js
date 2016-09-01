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
        pageLoad: false
    },
    created: function(){
        mainWindow.show();
        this.pageLoad = true;
    },
    methods: {
        closeWin: mainWindow.close,
        refreshWin: function () {
            mainWindow.reload();
        }
    }
});