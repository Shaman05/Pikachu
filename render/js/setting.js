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
        pageLoad: false,
        contentShow: 'nss',
        rubyVersion: '正在获取当前 ruby 版本号...',
        sassVersion: '正在获取当前 sass 版本号...',
        compassVersion: '正在获取当前 compass 版本号...',
        editConfig: getEntryConfig(config)
    },
    created: function(){
        var _this = this;
        this.pageLoad = true;
        mainWindow.show();
        util.getRubyVersion(function (msg) {
            _this.rubyVersion = msg;
        });
        util.getSassVersion(function (msg) {
            _this.sassVersion = msg;
        });
        util.getCompassVersion(function (msg) {
            _this.compassVersion = msg;
        });
    },
    computed: {
        canSave: function () {
            return !compareConfig(getEntryConfig(config), this.editConfig);
        }
    },
    methods: {
        closeWin: mainWindow.close,
        refreshWin: function () {
            mainWindow.reload();
        },
        tabSetting: function (contentName) {
            this.contentShow = contentName;
        },
        applySet: function () {
            var editConfig = this.editConfig;
            var customConfig = {
                nss: {
                    protocol: editConfig.protocol,
                    useRule: editConfig.useRule,
                    tplRule: editConfig.tplRule,
                    defaultPage: editConfig.defaultPage,
                    liveLoad: editConfig.liveLoad,
                    crossDomain: editConfig.crossDomain,
                    weinre: editConfig.weinre
                },
                sass: {
                    useCustomCompass: editConfig.useCustomCompass,
                    customCompass: editConfig.customCompass,
                    outStyle: editConfig.outStyle,
                    sourceMap: editConfig.sourceMap,
                    sourceComments: editConfig.sourceComments,
                    watch: editConfig.watch,
                    force: editConfig.force
                }
            };
            fs.writeFile(config.customSettingFile, JSON.stringify(customConfig, true, 4), function (err) {
                if(!err){
                    util.alert('设置已更新');
                }
            });
        },
        reset: function () {
            this.editConfig = getEntryConfig(util.getRuntimeConfig());
            fs.unlink(config.customSettingFile, function (err) {});
        }
    }
});

function getEntryConfig(config) {
    console.log(config);
    var nssConf = config.nss;
    var sassConf = config.sass;
    return {
        protocol: nssConf.protocol,
        useRule: nssConf.useRule,
        tplRule: nssConf.tplRule,
        defaultPage: nssConf.defaultPage,
        liveLoad: nssConf.liveLoad,
        crossDomain: nssConf.crossDomain,
        weinre: nssConf.weinre,

        useCustomCompass: sassConf.useCustomCompass,
        customCompass: sassConf.customCompass,
        outStyle: sassConf.outStyle,
        sourceMap: sassConf.sourceMap,
        sourceComments: sassConf.sourceComments,
        watch: sassConf.watch,
        force: sassConf.force
    }
}

//浅对比两个对象，完全相等返回 true
function compareConfig(saveConfig, newConfig) {
    for(var key in saveConfig){
        if(saveConfig.hasOwnProperty(key)){
            if(newConfig[key] !== saveConfig[key]){
                return false;
            }
        }
    }
    return true;
}