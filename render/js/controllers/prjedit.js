/**
 * Created by ChenChao on 2016/7/18.
 */

"use strict";

var electron = require('electron');
var remote = electron.remote;
var dialog = remote.dialog;
var util = require('../../../core/util');
var config = require('../../../config');

module.exports = function () {
    return Vue.extend({
        data: function (){
            return {
                id: '',
                name: '',
                port: '',
                path: '',
                showAdvanced: false,
                configTpl: '',
                proxyHost: '',
                proxyPath: '',
                createTime: '',
                isRunning: false,
                pid: '',

                isWap: false,
                unablePort: false,
                rename: false,
                useCache: true,
                canAdd: false
            }
        },
        template: util.template('prjedit.html'),
        computed: {
            canAdd: function (){
                return !!this.name && !!this.port && !!this.path;
            }
        },
        methods: {
            pathTo: util.pathTo,
            openDir: util.openDir,
            toggleAdvance: function(){
                this.showAdvanced = !this.showAdvanced;
            },
            selectPath: function(){
                var _self = this;
                dialog.showOpenDialog({
                    title: '选择项目目录路径',
                    properties: ['openDirectory']
                }, function (filenames){
                    _self.path = filenames && filenames[0];
                });
            },
            selectConfigFile: function(type){
                var _self = this;
                dialog.showOpenDialog({
                    title: '选择配置文件 *.' + type,
                    properties: ['openFile'],
                    filters: [
                        { name: type, extensions: [type] }
                    ]
                }, function (filenames){
                    _self[type == 'json' ? 'configFile' : 'configTpl'] = filenames && filenames[0];
                });
            },
            check: function(){
                var hosts = util.ls.get('hosts') || [];
                var rename = false;
                var unablePort = false;
                this.rename = false;
                this.unablePort = false;
                for(var i = 0; i < hosts.length; i++){
                    if(hosts[i].name == this.name){
                        this.rename = true;
                        rename = true;
                    }
                    if(hosts[i].port == this.port){
                        this.unablePort = true;
                        unablePort = true;
                    }
                }
                return !(rename || unablePort);
            },
            submit: function (){
                if(!this.canAdd){
                    return;
                    //util.warning('信息不完整', '项目名称，端口号，目录为必须字段');
                }
                if(!this.check()){
                    var msg = [];
                    if(this.rename){
                        msg.push('名称为已存在的项目名称！');
                    }
                    if(this.unablePort){
                        msg.push('端口号已被占用！')
                    }
                    util.warning(msg.join('\r\n'));
                    return;
                }
                /*if(this.port < 0 || this.port > 65536){
                    util.warning('端口配置错误！', '端口必须在0~65536之间');
                    return;
                }*/
                var hosts = util.ls.get('hosts') || [];
                var newHost = {
                    id: util.rid(),
                    name: this.name,
                    path: this.path,
                    configTpl: this.configTpl,
                    useCache: this.useCache,
                    port: this.port,
                    pid: '',
                    isWap: false,
                    proxyHost: this.proxyHost,
                    proxyPath: this.proxyPath,
                    isRunning: false,
                    createTime: new Date().toLocaleString()
                };
                var isOk = util.confirm(
                    '添加新的项目信息如下：\n' + JSON.stringify(newHost, null, 4) + '\n注意：项目一经添加不能修改，如要变动可删除项目后重新创建！',
                    '容我再看看',
                    '没问题，我要添加'
                );
                if(isOk){
                    hosts.push(newHost);
                    util.ls.set('hosts', hosts);
                    util.saveHosts(hosts);
                    util.pathTo('/prjList');
                }
            }
        }
    });
};