/**
 * Created by ChenChao on 2016/7/15.
 */

"use strict";

var path = require('path');
var fs = require('fs');
var os = require('os');
var child_process = require('child_process');
var stream = require('stream');
var _ = require('lodash');
var liner = new stream.Transform( { objectMode: true } );
var electron = require('electron');
var ipcRenderer = electron.ipcRenderer;
var shell = electron.shell;
var config = require('../config');
var compass = require('./compass');
var appConf = config.appInfo;
var includeRegExp = /<include\s+file=\"(.*?)\"><\/include>/;

module.exports = {
    isMac: function () {
        return process.platform === 'darwin';
    },
    //methods
    getRuntimeConfig: function () {
        var customSetting = fs.existsSync(config.customSettingFile) ? require(config.customSettingFile) : {};
        return _.merge(_.cloneDeep(config), _.cloneDeep(customSetting));
    },
    rid: function (len) {
        return Math.random().toString(len || 36).substr(2).toUpperCase();    
    },
    getLiner: function(){
        liner._transform = function (chunk, encoding, done) {
            var data = chunk.toString();
            if (this._lastLineData) data = this._lastLineData + data;

            var lines = data.split('\n');
            this._lastLineData = lines.splice(lines.length-1,1)[0];

            lines.forEach(this.push.bind(this));
            done()
        };

        liner._flush = function (done) {
            if (this._lastLineData) this.push(this._lastLineData);
            this._lastLineData = null;
            done()
        };
        return liner;
    },
    clone: function(obj){
        return !!obj ? JSON.parse(JSON.stringify(obj)) : obj;
    },
    extend: function(origin, target){
        for(var p in origin){
            if(origin.hasOwnProperty(p)){
                target[p] = target[p] || origin[p];
            }
        }
        return target;
    },
    extends: function(dest, from){
        var _this = this;
        var props = Object.getOwnPropertyNames(from), destination;
        props.forEach(function (name) {
            if (typeof from[name] === 'object') {
                if (typeof dest[name] !== 'object') {
                    dest[name] = {}
                }
                _this.extends(dest[name],from[name]);
            } else {
                destination = Object.getOwnPropertyDescriptor(from, name);
                Object.defineProperty(dest, name, destination);
            }
        });
        return dest;
    },
    template: function (tplFile) {
        var content = fs.readFileSync(path.join(config.templateDir, tplFile), {encoding: 'utf8'});
        var includes;
        while((includes = includeRegExp.exec(content)) !== null){
            var file = includes[1];
            var fileContent = fs.readFileSync(path.resolve(config.templateDir, file), 'utf-8');
            content = content.replace(includeRegExp, fileContent);
        }
        return content;
    },
    console: function (message, callback, type) {
        type = type || 'normal';
        if(appRoute.app.consoleWindow){
            try {
                message = message.replace(/[\r|\n]+/ig, '\r');
                message = message.replace(/\r/ig, '<br>');
                message = encodeURIComponent(message);
                appRoute.app.consoleWindow.webContents.executeJavaScript("window.consoleApp.printMsg(\"" + message + "\", \"" + type + "\");", true, function () {
                    callback && callback();
                });
            }catch (e){
                appRoute.app.consoleWindow.webContents.executeJavaScript("window.consoleApp.printMsg(\"" + e + "\", \"" + type + "\");", true, function () {
                    callback && callback();
                });
            }
        }
    },
    consoleInfo: function (message, callback) {
        this.console.apply(this, [message, callback, 'info']);
    },
    consoleError: function (message, callback) {
        this.console.apply(this, [message, callback, 'error']);
    },
    consoleWarning: function (message, callback) {
        this.console.apply(this, [message, callback, 'warning']);
    },
    consoleTask: function (taskLabel, taskName) {
        this.console(`[${new Date().toLocaleTimeString()}] ${taskLabel}: <span class="console-task-name">${taskName}</span>`);
    },

    //ui
    pathTo: function(path, query){
        appRoute.app.appLoading = true;
        setTimeout(function(){
            appRoute.app.appLoading = false;
            appRoute.go({
                path: path,
                query: query || {}
            });
        }, 300);
    },
    tip: function(message, isError){
        if(appRoute){
            appRoute.app.appShowTip = true;
            appRoute.app.appShowTipError = !!isError;
            appRoute.app.appTipMessage = message;
            setTimeout(function(){
                appRoute.app.appShowTip = false;
                appRoute.app.appShowTipError = false;
            }, 3000);
        }
    },
    tipError: function (message) {
        this.tip.apply(this, [message, true]);
    },
    alert: function (message, detail) {
        var remote = electron.remote;
        var dialog = remote.dialog;
        dialog.showMessageBox({
            type: 'info',
            title: config.title,
            message: message,
            detail: detail || '',
            buttons: ['OK']
        });
    },
    warning: function(message, detail){
        var remote = electron.remote;
        var dialog = remote.dialog;
        dialog.showMessageBox({
            type: 'warning',
            title: config.title,
            message: message,
            detail: detail || '',
            buttons: ['OK']
        });
    },
    confirm: function (message, cancelTxt, okTxt, detail){
        var remote = electron.remote;
        var dialog = remote.dialog;
        return dialog.showMessageBox({
            type: 'warning',
            title: config.title,
            message: message,
            detail: detail || '',
            buttons: [cancelTxt || 'Cancel', okTxt || 'Ok']
        });
    },
    notice: function(content, onclick){
        var myNotification = new Notification(appConf.title, {
            body: content
        });
        myNotification.onclick = function(){
            onclick && onclick();
        };
        this.console('[ ' + new Date().toLocaleTimeString() + ' ] ' + content);
    },

    //localStorage
    ls: {
        set: function (key, value) {
            if (this.get(key) !== null) {
                this.remove(key);
            }
            if (!value) {
                value = null;
            }
            if (Object.prototype.toString.call(value) === '[object Object]' || Object.prototype.toString.call(value) === '[object Array]') {
                value = JSON.stringify(value);
            }
            localStorage.setItem(key, value);
        },
        get: function (key) {
            var v = localStorage.getItem(key);
            v = v === undefined ? null : v;
            if (v === null) {
                return v;
            }
            try {
                return JSON.parse(v);
            } catch (e) {
                return v;
            }
        },
        remove: function (key) {
            localStorage.removeItem(key);
        },
        clear: function () {
            localStorage.clear();
        },
        each: function (fn) {
            var n = localStorage.length,
                i = 0,
                _fn = fn || function () {},
                key;
            for (; i < n; i++) {
                key = localStorage.key(i);
                if (_fn.call(this, key, this.get(key)) === false) {
                    break;
                }
                if (localStorage.length < n) {
                    n--;
                    i--;
                }
            }
        }
    },

    //file
    getContent: function (filePath, callback) {
        fs.readFile(filePath, {encoding: 'utf8'}, function (err, content) {
            callback && callback(err ? err : content);
        });
    },
    getJson: function (jsonFile, callback) {
        this.getContent(jsonFile, function (content) {
            try {
                return callback(JSON.parse(content));
            }catch (e){
                return {
                    error: content
                }
            }
        });
    },
    getPrjData: function (prjName, callback) {
        this.getJson(config.hostsFile, function (data) {
            callback(data);
        });
    },
    getFileSize: function (size) {
        var kb = 1024;
        var mb = kb * 1024;
        var gb = mb * 1024;
        var tb = gb * 1024;
        if(size > tb){
            return p2Number(size/tb) + 'TB';
        }
        if(size > gb){
            return p2Number(size/gb) + 'GB';
        }
        if(size > mb){
            return p2Number(size/mb) + 'MB';
        }
        if(size > kb){
            return p2Number(size/kb) + 'KB';
        }
        return size + 'Bytes';
        function p2Number(num){
            return Math.ceil(num * 100)/100;
        }
    },

    //system
    runTask: function (cwd, task, callback) {
        var util = this;
        child_process.exec(task, {
            cwd: cwd
        }, function(error, stdout, stderr){
            if(error !== null){
                util.consoleError(error.stack);
                util.tipError('任务执行出错，详情查看控制台！');
            }else{
                util.tip('任务执行完成！');
                util.consoleInfo(stdout);
                if(stderr){
                    util.consoleWarning(stderr);
                }
            }
            callback && callback(error);
        });
    },
    getReadMe: function () {
        return fs.readFileSync(config.readMeFile, {encoding: 'utf8'});
    },
    getHostInfo: function (id) {
        var hosts = this.ls.get('hosts') || [];
        for(var i = 0; i < hosts.length; i++){
            if(id === hosts[i].id){
                return hosts[i];
            }
        }
        return null;
    },
    saveHosts: function(hosts){
        var data = '';
        if(hosts && hosts.length > 0){
            for(var i = 0; i < hosts.length; i++){
                delete hosts[i].isRunning;
                delete hosts[i].pid;
            }
        }
        try{
            data = JSON.stringify(hosts, null, 2);
        }catch(e){
            console.log(e);
            return;
        }
        fs.writeFile(config.hostsFile, data, function(err){});
    },
    openDir: function(fullPath){
        shell.openItem(fullPath);
    },
    openUrl: function (url) {
        child_process.exec([this.isMac() ? 'open' : 'start', url].join(' '));
    },
    about: function(){
        var remote = electron.remote;
        var dialog = remote.dialog;
        var app = remote.app;
        var message = [
            `Node 版本: ${process.versions.node}`,
            `Chrome 版本: ${process.versions.chrome}`,
            `Electron 版本: ${process.versions.electron}`,
            `System: ${config.osType} / ${config.osPlatform}`,
            `${appConf.title} 版本: ${appConf.version}`,
            `Author: ${appConf.author} <${appConf.gitHub}>`
        ];
        dialog.showMessageBox({
            type: 'info',
            icon: config.logo,
            title: config.title,
            message: message.join('\n'),
            buttons: ['OK']
        });
    },
    closeApp: function(){
        //不能仅仅关闭窗口，应该要通知主进程退出app
        ipcRenderer.send('app quit', 'app quit at ' + new Date());
    },
    
    //logic
    setSassOurDir: function (file) {
        var remote = electron.remote;
        var dialog = remote.dialog;
        var _this = this;
        dialog.showOpenDialog({
            title: '选择输出位置',
            properties: ['openDirectory'],
            defaultPath: file.cssDir
        }, function (filenames){
            file.cssDir = filenames && filenames[0] || file.cssDir;
            _this.ls.set(file.fullPath, file);
        });
    },
    getSassCompileOptions: function (file) {
        return {
            sourceMap: file.sourceMap,
            sourceComments: file.sourceComments,
            outStyle: file.outStyle,
            watch: file.watch,
            cssDir: file.cssDir
        }
    },
    getRubyVersion: function (cb) {
        compass.getRubyVersion(function (stdOut, code) {
            cb(code == 0 ? stdOut : '获取 ruby 版本失败！');
        });
    },
    getSassVersion: function (cb) {
        compass.getSassVersion(function (stdOut, code) {
            cb(code == 0 ? stdOut : '获取 sass 版本失败！');
        });
    },
    getCompassVersion: function (cb) {
        compass.getCompassVersion(function (stdOut, code) {
            cb(code == 0 ? stdOut : '获取 compass 版本失败！');
        });
    }
};