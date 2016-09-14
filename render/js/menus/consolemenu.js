/**
 * Created by ChenChao on 2016/8/1.
 */

"use strict";

var electron = require('electron');
var remote = electron.remote;
var Menu = remote.Menu;
var MenuItem = remote.MenuItem;
var mainWindow = remote.getCurrentWindow();
var webContents = mainWindow.webContents;

var contextMenu = new Menu();
var copy = new MenuItem({
    label: '复制',
    role: 'copy',
    enabled: true
});

var fontSize = new Menu();
fontSize.append(fontSizeItem(12));
fontSize.append(fontSizeItem(13, true));
fontSize.append(fontSizeItem(14));
fontSize.append(fontSizeItem(15));
fontSize.append(fontSizeItem(16));
var fontSizeMenu = new MenuItem({
    label: '字体大小',
    submenu: fontSize
});

var clear = new MenuItem({
    label: '清空控制台',
    click: function () {
        webContents.executeJavaScript('window.consoleApp.clear();');
    }
});
var exit = new MenuItem({
    label: '关闭',
    click: function () {
        mainWindow.close();
    }
});
contextMenu.append(copy);
contextMenu.append(fontSizeMenu);
contextMenu.append(clear);
contextMenu.append(exit);

module.exports = contextMenu;

function fontSizeItem(fontSize, checked) {
    return new MenuItem({
        label: fontSize + 'px',
        type: 'radio',
        checked: !!checked,
        click: function () {
            webContents.executeJavaScript('window.consoleApp.setFontSize(' + fontSize + ');');
        }
    });
}