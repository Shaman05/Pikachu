/**
 * Created by ChenChao on 2016/7/22.
 */

var path = require('path');
var fs = require('fs');
var child_process = require('child_process');
var log = require('./log');
var config = require('../config');
var hosts = {};

module.exports = {
    getHost: function (pid) {
        return hosts[pid] || null;
    },
    getHosts: function () {
        return hosts;
    },
    startHost: function(host, onError){
        var hostDir = host.path;
        var port = host.port;
        var proxyHost = host.proxyHost || 'none';
        var proxyPath = host.proxyPath || 'none';
        var configFile = host.configFile || 'none';
        var configTpl = host.configTpl || 'none';
        var useCache = host.useCache;

        var args = [
            path.join(path.resolve(__dirname, '../'), 'webserver/server.js'),
            port,
            proxyHost,
            proxyPath,
            configFile,
            configTpl,
            useCache
        ];
        var newHost = child_process.spawn('node', args, {
            cwd: hostDir
        });
        log.info('[ start host args: ' + args.join(' ') + ' ]', true);
        newHost.stderr.setEncoding('utf8');
        newHost.stderr.on('data', function (data) {
            log.info([hostDir, data].join('\r\n'), false, true);
            try{
                newHost.kill();
            }catch (e){}
            onError && onError(data);
        });
        newHost.stdout.setEncoding('utf8');
        newHost.stdout.on('data', function (data) {
            log.info([hostDir, data].join('\r\n'));
        });
        newHost.on('close', function (code) {
            log.info([hostDir, 'child process exited with code : ' + code].join('\r\n'));
        });
        hosts[newHost.pid] = newHost;
        return newHost;
    },
    stopHost: function (pid) {
        var host = hosts[pid];
        if(host){
            host.kill();
            delete hosts[pid];
        }
    },
    stopAll: function () {
        for(var pid in hosts){
            if(hosts.hasOwnProperty(pid)){
                try {
                    hosts[pid].kill();
                }catch (e){}
            }
        }
    }
};