/**
 * Created by ChenChao on 2016/8/26.
 */

"use strict";

var path = require('path');
var os = require('os');
var fs = require('fs');
var pkg = require('./package.json');

var appRoot = process.cwd();
var dataDir = path.join(appRoot, 'data');
var addOnDir = path.join(appRoot, 'addon');
var rubyCmd = path.join(addOnDir, 'ruby', 'bin', 'ruby.exe');
var sassCmd = path.join(addOnDir, 'bin', 'sass');
var compassCmd = path.join(addOnDir, 'bin', 'compass');

var baseConfig = {
    appRoot: appRoot,
    osType: os.type(),
    osPlatform: os.platform(),
    dataDir: dataDir,
    enterUrl: `file://${appRoot}/index.html#!/index`,
    templateDir: path.join(appRoot, 'render/template'),
    readMeFile: path.join(appRoot, 'README.md'),
    logFile: path.join(dataDir, 'vhost.log'),
    hostsFile: path.join(dataDir, 'vhost.json'),
    customSettingFile: path.join(dataDir, 'setting.json'),
    logo: path.join(appRoot, `render/images/logo/logo.png`),
    folder: path.join(appRoot, `render/images/Close_Folder.png`),
    folderIcon: path.join(appRoot, `render/images/Close_Folder_icon.png`),
    refresh: true,
    mainDevTool: true,
    devTool: false,

    //插件配置
    addOn: {
        rubyCmd: rubyCmd,
        sassCli: ['-S', sassCmd],
        compassCli: ['-S', compassCmd]
    },

    //应用信息
    appInfo: {
        title: pkg.name,
        version: pkg.version,
        author: pkg.author,
        gitHub: `https://github.com/Shaman05`,
        height: 600,
        width: 800
    },

    //nss默认设置
    nss: {
        protocol: 'http',
        liveLoad: true,
        defaultPage: false,
        crossDomain: true,
        weinre: false,
        useRule: false,
        tplRule: path.join(appRoot, `webserver/addon/base-tpl.js`)
    },

    //sass默认设置
    sass: {
        sourceMap: true,
        sourceComments: false,
        outStyle: 'compressed', //Values: nested, expanded, compact, compressed
        watch: false,
        force: false,
        useCustomCompass: false,
        customCompass: ''
    }
};

module.exports = baseConfig;