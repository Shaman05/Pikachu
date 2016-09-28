/**
 * Created by ChenChao on 2016/8/1.
 */

"use strict";

var electron = require('electron');
var remote = electron.remote;
var Menu = remote.Menu;
var MenuItem = remote.MenuItem;
var util = require('../../../core/util');
var sass = require('../../../core/sass');

module.exports = function (file) {
    var contextMenu = new Menu();
    var fileInfo = new MenuItem({
        label: '文件信息',
        click: function () {
            util.alert(file.name, [
                `大小：${util.getFileSize(file.size)}`,
                `位置：${file.path}`,
                `创建日期：${file.birthTime}`,
                `修改日期：${file.mTime}`
            ].join('\r'));
        }
    });
    var openDir = new MenuItem({
        label: '打开源文件目录',
        click: function () {
            util.openDir(file.path);
        }
    });
    var openOutDir = new MenuItem({
        label: '打开输出文件目录',
        click: function () {
            util.openDir(file.cssDir);
        }
    });
    var setDistDir = new MenuItem({
        label: '设置输出目录',
        click: function () {
            util.setSassOurDir(file);
        }
    });
    var compileOpts = new Menu();
    var formatStyle = new Menu();
    var compileOpt = new MenuItem({
        label: '编译选项',
        submenu: compileOpts
    });

    compileOpts.append(new MenuItem({
        label: 'Source map',
        sublabel: '是否输出map文件',
        type: 'checkbox',
        checked: file.sourceMap,
        click: function () {
            file.sourceMap = !file.sourceMap;
            util.ls.set(file.fullPath, file);
        }
    }));
    compileOpts.append(new MenuItem({
        label: 'Source comments',
        sublabel: '是否输出额外的调试信息',
        type: 'checkbox',
        checked: file.sourceComments,
        click: function () {
            file.sourceComments = !file.sourceComments;
            util.ls.set(file.fullPath, file);
        }
    }));
    compileOpts.append(new MenuItem({type: 'separator'}));
    compileOpts.append(new MenuItem({
        label: '输出格式',
        sublabel: `当前：${file.outStyle}`,
        submenu: formatStyle
    }));
    formatStyle.append(new MenuItem({
        label: 'nested',
        sublabel: '层级嵌套',
        checked: file.outStyle == 'nested',
        type: 'radio',
        click: function () {
            file.outStyle = 'nested';
            util.ls.set(file.fullPath, file);
        }
    }));
    formatStyle.append(new MenuItem({
        label: 'expanded',
        sublabel: '正常展开格式',
        checked: file.outStyle == 'expanded',
        type: 'radio',
        click: function () {
            file.outStyle = 'expanded';
            util.ls.set(file.fullPath, file);
        }
    }));
    formatStyle.append(new MenuItem({
        label: 'compact',
        sublabel: '单行紧凑输出',
        checked: file.outStyle == 'compact',
        type: 'radio',
        click: function () {
            file.outStyle = 'compact';
            util.ls.set(file.fullPath, file);
        }
    }));
    formatStyle.append(new MenuItem({
        label: 'compressed',
        sublabel: '完全压缩',
        checked: file.outStyle == 'compressed',
        type: 'radio',
        click: function () {
            file.outStyle = 'compressed';
            util.ls.set(file.fullPath, file);
        }
    }));
    var compile = new MenuItem({
        label: '编译',
        click: function () {
            sass.compile(file, 'sass');
        }
    });

    contextMenu.append(fileInfo);
    contextMenu.append(openDir);
    contextMenu.append(openOutDir);
    contextMenu.append(setDistDir);
    contextMenu.append(new MenuItem({type: 'separator'}));
    contextMenu.append(compileOpt);
    contextMenu.append(compile);
    return contextMenu;
};