/**
 * Created by ChenChao on 2016/7/18.
 */

"use strict";

var util = require('../../../core/util');
var vhost = require('../../../core/vhost');

module.exports = function () {
    return Vue.extend({
        data: function (){
            return {
                hosts: util.ls.get('hosts') || []
            };
        },
        template: util.template('prjlist.html'),
        created: function (){
            //
        },
        methods: {
            pathTo: util.pathTo,
            startHost: function (host){
                var _this = this;
                var newHost = vhost.startHost(host, function (err) {
                    host.pid = '';
                    host.isRunning = false;
                    util.ls.set('hosts', _this.hosts);
                    util.notice(`${host.name} 发生异常，已停止，详情查看日志！`);
                });
                if(newHost && newHost.pid){
                    host.pid = newHost.pid;
                    host.isRunning = true;
                    util.ls.set('hosts', this.hosts);
                    util.notice(`${host.name} 已启动！`);
                }
            },
            stopHost: function (host){
                if(host.pid) {
                    vhost.stopHost(host.pid);
                    host.pid = '';
                    host.isRunning = false;
                    util.ls.set('hosts', this.hosts);
                    util.notice(`${host.name} 已停止！`);
                }else{
                    util.tip(host.name + ' 尚未运行！');
                }
            },
            openDir: function (path) {
                util.openDir(path);
            },
            visitSite: function (host){
                util.openUrl('http://localhost:' + host.port);
            },
            removeHost: function (index, host){
                var isOk = util.confirm(`确定要移除 ${host.name} 吗？`, '让我再考虑考虑', '确定，删了它吧');
                if(isOk){
                    this.hosts.splice(index, 1);
                    vhost.stopHost(host.pid);
                    util.ls.set('hosts', this.hosts);
                    util.saveHosts(this.hosts);
                }
            },
            hostInfo: function (host){
                util.pathTo(`/prjInfo/${host.id}`);
            }
        }
    });
};