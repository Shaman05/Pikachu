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
                    util.ls.set('hosts', _this.hosts);
                    util.notice(`${host.name} 发生异常，已停止，详情查看日志！`);
                });
                if(newHost && newHost.pid){
                    host.pid = newHost.pid;
                    host.isRunning = true;
                    util.ls.set('hosts', this.hosts);
                    //util.notice(`${host.name} 已启动！`);
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
                    this.unselectHost();
                }
            },
            hostInfo: function (host){
                util.pathTo(`/prjInfo/${host.id}`);
            }
        }
    });
};