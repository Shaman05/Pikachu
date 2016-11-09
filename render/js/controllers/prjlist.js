/**
 * Created by ChenChao on 2016/7/18.
 */

"use strict";

var electron = require('electron');
var remote = electron.remote;
var util = require('../../../core/util');
var vhost = require('../../../core/vhost');
var prjListMenu = require('../menus/prjlistmenu');

module.exports = function () {
    return Vue.extend({
        data: function (){
            return {
                expanded: true,
                currentHostName: '',
                hosts: util.ls.get('hosts') || []
            };
        },
        template: util.template('prjlist.html'),
        created: function (){
            var sortData = util.ls.get('sortData') || {
                    type: 'createTime',
                    desc: true
                };
            this.sortItem(sortData.type, sortData.desc);
            this.currentHostName = this.$route.query.prjName || '';
            for(var i = 0; i < this.hosts.length; i++){
                var host = this.hosts[i];
                //如果有项目运行则启动监控
                host.isRunning && this.monitor(host);
            }
        },
        methods: {
            pathTo: util.pathTo,
            toggleNav: function () {
                this.expanded = !this.expanded;
            },
            selectHost: function (e, name) {
                this.currentHostName = name;
                e.stopPropagation();
            },
            unselectHost: function () {
                this.currentHostName = '';
            },
            popPrjListMenu: function (e) {
                setTimeout(function () {
                    prjListMenu.popup(remote.getCurrentWindow());
                }, 50);
            },
            sortItem: function (type, desc) {
                this.hosts.sort(function (a, b) {
                    if(a[type] < b[type]){
                        return desc ? 1 : -1;
                    }
                    if(a[type] > b[type]){
                        return desc ? -1 : 1;
                    }
                    return 0;
                });
                util.ls.set('sortData', {
                    type: type,
                    desc: desc
                });
            },
            createNewPrj: function () {
                util.pathTo('/prjEdit');
            },
            startHost: function (host){
                var _this = this;
                var newHost = vhost.startHost(host, function (err) {
                    host.pid = '';
                    host.isRunning = false;
                    host.cpu = '--';
                    host.mem = '--';
                    util.ls.set('hosts', _this.hosts);
                    util.notice(`${host.name} 发生异常，已停止，详情查看日志！`);
                    _this.unmonitor(host);
                });
                if(newHost && newHost.pid){
                    host.pid = newHost.pid;
                    host.isRunning = true;
                    host.cpu = '--';
                    host.mem = '--';
                    util.ls.set('hosts', this.hosts);
                    //util.notice(`${host.name} 已启动！`);
                    _this.monitor(host);
                }
            },
            stopHost: function (host){
                if(host.pid) {
                    vhost.stopHost(host.pid);
                    host.pid = '';
                    host.isRunning = false;
                    host.cpu = '--';
                    host.mem = '--';
                    util.ls.set('hosts', this.hosts);
                    util.notice(`${host.name} 已停止！`);
                    this.unmonitor(host);
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
                    this.unselectHost();
                }
            },
            hostInfo: function (host){
                util.pathTo(`/prjInfo/${host.id}`);
            },
            getHostUsage: function (host) {
                var pid = host.pid;
                pid && vhost.getHostUsage(pid, function (result) {
                    console.log(pid, result);
                    console.log(vhost.getHostUsageHistory(pid))
                });
            },
            monitor: function (host) {
                host.monitorId = setInterval(function () {
                    vhost.getHostUsage(host.pid, function (result) {
                        host.cpu = result.cpu.toFixed(2) + '%';
                        host.mem = formatSize(result.memory);
                    });
                }, 1000);
            },
            unmonitor: function (host) {
                vhost.unmonitor(host);
                if(host.monitorId){
                    clearInterval(host.monitorId);
                    host.cpu = '--';
                    host.mem = '--';
                    delete host.monitorId;
                }
            }
        }
    });

    function formatSize(size){
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
    }
};