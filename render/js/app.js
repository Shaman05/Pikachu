/**
 * Created by ChenChao on 2016/7/15.
 */


"use strict";

var electron = require('electron');
var remote = electron.remote;
var menus = require('./mainmenu');
var util = require('../../core/util');
var ipcRenderer = electron.ipcRenderer;
var mainWindow = remote.getCurrentWindow();
var clearPrjMenu = menus.prjMenu.items[2];
var consoleMenu = menus.winMenu.items[0];

module.exports.start = function(config){
    //来自主进程中的消息事件
    ipcRenderer.on('app quit', function(event, message) {
        var hosts = util.ls.get('hosts') || [];
        for(var i = 0; i < hosts.length; i++){
            hosts[i].isRunning = false;
        }
        util.ls.set('hosts', hosts);
    });
    ipcRenderer.on('console close', function(event, message){
        consoleMenu.enabled = true;
    });
    ipcRenderer.on('console open', function(event, message){
        consoleMenu.enabled = false;
    });

    //controllers
    var index = require('./controllers/index')();
    var setting = require('./controllers/setting')();
    var prjEdit = require('./controllers/prjedit')();
    var prjList = require('./controllers/prjlist')();
    var prjInfo = require('./controllers/prjinfo')();

    var Router = new VueRouter();
    var App = Vue.extend({
        data: function(){
            return {
                appName: config.title,
                appLoading: true,
                appShowTip: false,
                appShowTipError: false,
                appTipMessage: '系统默认提示信息：这里是前端项目管理器！',
                consoleWindow: null
            };
        },
        created: function(){
            mainWindow.show();
            this.appLoading = false;
        },
        methods: {
            openMenu: function(index, e){
                var $target = e.target;
                if(menus[index]){
                    menus[index].popup($target.offsetLeft, $target.offsetTop + $target.clientHeight);
                }
            },
            closeApp: util.closeApp,
            pathTo: util.pathTo
        }
    });
    Router.map({
        '/index': {
            component: index
        },
        '/setting': {
            component: setting
        },
        '/prjEdit': {
            component: prjEdit
        },
        '/prjList': {
            component: prjList
        },
        '/prjInfo/:id': {
            component: prjInfo
        }
    });
    Router.beforeEach(function (transition) {
        clearPrjMenu.enabled = transition.to.path === '/prjList';
        transition.next();
    });
    Router.start(App, '#app');
    return Router;
};