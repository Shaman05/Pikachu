/**
 * Created by ChenChao on 2016/7/15.
 */

"use strict";

var path = require('path');
var electron = require('electron');
var ipcRenderer = electron.ipcRenderer;
var remote = electron.remote;
var Menu = remote.Menu;
var MenuItem = remote.MenuItem;
var BrowserWindow = remote.BrowserWindow;
var mainWindow = remote.getCurrentWindow();
var webContents = mainWindow.webContents;
var vhost = require('../../core/vhost');
var util = require('../../core/util');
var config = require('../../config');
var appConf = config.appInfo;

//Project
var prjMenu = new Menu();
var newPrj = new MenuItem({
    label: '添加项目',
    click: function(){
        util.pathTo('/prjEdit');
    }
});
var prjList = new MenuItem({
    label: '查看项目',
    click: function(){
        util.pathTo('/prjList');
    }
});
var clearPrj = new MenuItem({
    label: '清除所有项目',
    enabled: false,
    click: function(){
        if(appRoute.app.$route.path == '/prjList'){
            if(util.confirm('确认清除所有项目吗？', '', '', '删除操作不可逆，请慎重!')){
                vhost.stopAll();
                util.ls.set('hosts', []);
                util.saveHosts([]);
                appRoute.app.appLoading = true;
                setTimeout(function () {
                    appRoute.app.appLoading = false;
                    appRoute.app.$children[0].hosts = [];
                }, 300);
            }
        }
    }
});
var log = new MenuItem({
    label: '查看日志',
    click: function(){
        appRoute.app.appLoading = true;
        setTimeout(function(){
            appRoute.app.appLoading = false;
            var win = new BrowserWindow({
                width: 700,
                height: 500,
                minWidth: 480,
                minHeight: 300,
                title: `日志（${config.logFile}）`,
                icon: config.logo,
                autoHideMenuBar: true,
                frame: false,
                show: false
            });
            //config.devTool && win.webContents.openDevTools();
            win.loadURL(path.join(config.templateDir, 'log.html'));
            appRoute.app.logWindow = win;
            ipcRenderer.send('logger open', new Date() + ' logger window opened!');
            win.on('close', function(e){
                appRoute.app.logWindow = win = null;
                ipcRenderer.send('logger close', new Date() + ' logger window closed!');
            });
        }, 300);
    }
});
prjMenu.append(newPrj);
prjMenu.append(prjList);
prjMenu.append(clearPrj);
prjMenu.append(log);

//edit
var editMenu = new Menu();
var undo = new MenuItem({
    role: 'undo',
    enabled: false
});
var redo = new MenuItem({
    role: 'redo',
    enabled: false
});
var cut = new MenuItem({
    role: 'cut',
    enabled: false
});
var copy = new MenuItem({
    role: 'copy',
    enabled: false
});
var paste = new MenuItem({
    role: 'paste',
    enabled: false
});
editMenu.append(undo);
editMenu.append(redo);
editMenu.append(cut);
editMenu.append(copy);
editMenu.append(paste);

//Window
var winMenu = new Menu();
var devTool = new MenuItem({
    label: '控制台 - DevTool',
    click: function(){
        if(webContents.isDevToolsOpened()){
            webContents.closeDevTools();
        }else{
            webContents.openDevTools();
        }
    }
});
var consoleLog = new MenuItem({
    label: '控制台 - Console',
    click: function(){
        var win = new BrowserWindow({
            width: 700,
            height: 500,
            minWidth: 480,
            minHeight: 300,
            title: '控制台 - Console',
            icon: config.logo,
            autoHideMenuBar: true,
            frame: false,
            show: false
        });
        win.loadURL(path.join(config.templateDir, '/console.html'));
        //config.devTool && win.webContents.openDevTools();
        appRoute.app.consoleWindow = win;
        ipcRenderer.send('console open', new Date() + ' console window opened!');
        win.on('close', function(e){
            appRoute.app.consoleWindow = win = null;
            ipcRenderer.send('console close', new Date() + ' console window closed!');
        });
    }
});
var refresh = new MenuItem({
    label: '刷新',
    click: function(item, focusedWindow){
        focusedWindow.reload();
    }
});
var exit = new MenuItem({
    label: '退出',
    click: util.closeApp
});
winMenu.append(consoleLog);
config.devTool && winMenu.append(devTool);
config.refresh && winMenu.append(refresh);
winMenu.append(exit);

//setting
var settingMenu = new Menu();
var theme = new MenuItem({
    label: '主题设置',
    enabled: false,
    click: function(item, win){
    }
});
var globalSet = new MenuItem({
    label: '设 置',
    //icon: path.join(config.appRoot, '/render/images/menu_icon_settings.png'),
    click: function(){
        appRoute.app.appLoading = true;
        setTimeout(function(){
            appRoute.app.appLoading = false;
            var win = new BrowserWindow({
                width: 700,
                height: 500,
                title: `设置`,
                icon: config.logo,
                autoHideMenuBar: true,
                resizable: false,
                frame: false,
                show: false
            });
            win.loadURL(path.join(config.templateDir, 'setting.html'));
            config.devTool && win.webContents.openDevTools();
            appRoute.app.settingWindow = win;
            ipcRenderer.send('setting open', new Date() + ' console window opened!');
            win.on('close', function(e){
                appRoute.app.settingWindow = win = null;
                ipcRenderer.send('setting close', new Date() + ' console window closed!');
            });
        }, 300);
    }
});
settingMenu.append(theme);
settingMenu.append(globalSet);

//Help
var helpMenu = new Menu();
var homePage = new MenuItem({
    label: 'Home page',
    click: function(){
        util.pathTo('/index');
    }
});
var readMe = new MenuItem({
    label: 'README.md',
    click: function(){
        //todo
    }
});
var useMenu = new MenuItem({
    label: '使用帮助',
    click: function(){

    }
});
var feedBack = new MenuItem({
    label: '建议和反馈',
    click: function(){

    }
});
var checkUpdate = new MenuItem({
    label: '检查更新',
    click: function(){
        //console.log(appRoute.app.consoleWindow.webContents.window);
        console.log(BrowserWindow.getAllWindows());
    }
});
var about = new MenuItem({
    label: `关于 ${appConf.title}`,
    icon: config.logo,
    click: util.about
});
helpMenu.append(homePage);
helpMenu.append(readMe);
helpMenu.append(useMenu);
helpMenu.append(feedBack);
helpMenu.append(new MenuItem({type: 'separator'}));
helpMenu.append(checkUpdate);
helpMenu.append(about);

module.exports = [prjMenu, editMenu, winMenu, settingMenu, helpMenu];
module.exports.prjMenu = prjMenu;
module.exports.editMenu = editMenu;
module.exports.winMenu = winMenu;
module.exports.settingMenu = settingMenu;
module.exports.helpMenu = helpMenu;