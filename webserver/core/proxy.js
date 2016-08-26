/**
 * Created by ChenChao on 2016/3/8.
 * 代理模块
 */

var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer({});

module.exports = {

    proxy: function(req, res, proxyHost){
        proxy.web(req, res, {
            target: proxyHost
        });
    }
};