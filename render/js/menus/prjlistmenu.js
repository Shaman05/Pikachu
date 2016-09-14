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
var util = require('../../../core/util');
var config = require('../../../config');

//默认排序规则
var sortData = util.ls.get('sortData') || {
        type: 'createTime',
        desc: true
    };
var type = sortData.type;
var desc = sortData.desc;

var contextMenu = new Menu();
var sortMenus = new Menu();
sortMenus.append(new MenuItem({
    label: '名称',
    type: 'radio',
    checked: type === 'name',
    click: function () {
        type = 'name';
        applySort();
    }
}));
sortMenus.append(new MenuItem({
    label: '创建时间',
    type: 'radio',
    checked:  type === 'createTime',
    click: function () {
        type = 'createTime';
        applySort();
    }
}));
sortMenus.append(new MenuItem({
    label: '运行状态',
    type: 'radio',
    checked: type === 'isRunning',
    click: function () {
        type = 'isRunning';
        applySort();
    }
}));
sortMenus.append(new MenuItem({
    type: 'separator'
}));
sortMenus.append(new MenuItem({
    label: '递增',
    type: 'radio',
    checked: !desc,
    click: function () {
        desc = false;
        applySort();
    }
}));
sortMenus.append(new MenuItem({
    label: '递减',
    type: 'radio',
    checked: desc,
    click: function () {
        desc = true;
        applySort();
    }
}));

var sortMenu = new MenuItem({
    label: '排序方式',
    submenu: sortMenus
});
var newPrjMenu = new MenuItem({
    label: '创建新项目',
    icon: config.folderIcon,
    click: function () {
        webContents.executeJavaScript('window.appRoute.app.$children[0].createNewPrj()');
    }
});

contextMenu.append(sortMenu);
contextMenu.append(new MenuItem({
    type: 'separator'
}));
contextMenu.append(newPrjMenu);
module.exports = contextMenu;

function applySort() {
    webContents.executeJavaScript('window.appRoute.app.$children[0].sortItem("' + type + '", ' + desc + ')');
}