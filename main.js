/**
 * Created by ChenChao on 2016/6/28.
 */

"use strict";

var electron = require('electron');
var globalShortcut = electron.globalShortcut;
var fs = require('fs');

var app = electron.app;
var ipcMain = electron.ipcMain;
var BrowserWindow = electron.BrowserWindow;
var Menu = electron.Menu;
var Tray = electron.Tray;

var mainWindow;
var appIcon = null;
var config = require('./config/main.conf');

appInit();

function createWindow(){
    mainWindow = new BrowserWindow({
        width: config.winWidth,
        height: config.winHeight,
        title: config.title,
        icon: config.logo,
        resizable: false,
        show: false,
        frame: false
    });
    mainWindow.loadURL(config.enterUrl);
    mainWindow.on('closed', function (){
        mainWindow = null;
    });

    createMenu();
    createDataDir();
    config.devTool && mainWindow.webContents.openDevTools();
    config.refresh && globalShortcut.register('ctrl+r', function() {
        mainWindow.reload();
    });
}

function createMenu(){
    appIcon = new Tray(config.logo);
    var contextMenu = Menu.buildFromTemplate([
        {
            label: '显示主窗口',
            click: function () {
                mainWindow.show();
            }
        },
        {
            type: 'separator'
        },
        {
            label: '退出',
            click: function(){
                mainWindow.destroy();
            }
        }
    ]);
    appIcon.setToolTip(`${config.title}\n当前版本: ${config.version}\n已是最新版本`);
    appIcon.setContextMenu(contextMenu);
    appIcon.on('click', function(){
        var isVisible = mainWindow.isVisible();
        var isMinimized = mainWindow.isMinimized();
        mainWindow[isVisible ? isMinimized ? 'show' : 'hide' : 'show']();
    });
}

function createDataDir(){
    fs.exists(config.dataDir, function (exists) {
        if(!exists){
            fs.mkdir(config.dataDir, function(err){});
        }
    });
}

function appInit(){
    app.on('ready', createWindow);
    app.on('before-quit', function(event){
        mainWindow.webContents.send('app quit', 'App quit at ' + new Date());
        appIcon && appIcon.destroy();
    });
    app.on('window-all-closed', function (){
        if(process.platform !== 'darwin'){
            app.quit()
        }
    });
    app.on('activate', function (){
        if(mainWindow === null){
            createWindow()
        }
    });

    ipcMain.on('app quit', function(event, quitMsg) {
        app.quit();
    });
    ipcMain.on('console open', function (event, message) {
        event.sender.send('console open', message);
    });
    ipcMain.on('console close', function (event, message) {
        event.sender.send('console close', message);
    });
}