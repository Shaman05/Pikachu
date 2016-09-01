/**
 * Created by admin on 2016/8/26.
 */

"use strict";

var path = require('path');
var os = require('os');
var fs = require('fs');
var _ = require('lodash');
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
    refresh: true,
    devTool: true,

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

    //sass默认设置
    sass: {
        sourceMap: true,
        sourceComments: false,
        outStyle: 'compressed', //Values: nested, expanded, compact, compressed
        watch: false
    }
};

module.exports = _.merge(baseConfig, getCustomConfig());

function getCustomConfig() {
    return fs.existsSync(baseConfig.customSettingFile) ? require(baseConfig.customSettingFile) : {};
}