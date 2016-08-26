/**
 * Created by ChenChao on 2016/3/8.
 * 创建web服务类
 */

var _HTTP_ = require('http');
var _HTTPS_ = require('https');
var _URL_ = require('url');

var log = require('./log');
var serverConf = require('../config/server.conf');
var protocol = serverConf['protocol'] === 'https' ? _HTTPS_ : _HTTP_;
var port = serverConf.port || process.argv[2];

function Server(handlers){
    this.handlers = handlers;
    this.server = protocol.createServer(this.handleRequest.bind(this));
}

Server.prototype.start = function (){
    this.port = port;
    this.server.listen(port);
    this.server.setMaxListeners(0);
    this.childProcess = null;
    log.config({
        level: 1
    });
    log.write('Http Server running at http://localhost:' + port + '/');
    console.log('Http Server running at http://localhost:' + port + '/');
    setInterval(function (){
        log.dispose();
    }, 24 * 60 * 60 * 1000);
};

Server.prototype.parseUrl = function (urlString){
    var parsed = _URL_.parse(urlString);
    parsed.pathname = _URL_.resolve('/', parsed.pathname);
    return _URL_.parse(_URL_.format(parsed), true);
};

//异常处理
Server.prototype.uncaughtException = function (req, res){
    //todo
};

//这里是所有请求的入口
Server.prototype.handleRequest = function (req, res){
    log.write(req.method + ' ' + req.url);
    if(req.headers['user-agent']){
        log.writeAgent(req.headers['user-agent']);
    }
    this.uncaughtException(req, res);  //todo 需要优化异常处理
    req.url = this.parseUrl(req.url);
    res = this.addHeaders(req, res);
    var handler = this.handlers[req.method];
    if(!handler){
        log.write('There is no response handler to handle the request!');
        res.writeHead(501);
        res.end();
    }else{
        handler.call(this, req, res);
    }
};

//添加配置中指定的头
Server.prototype.addHeaders = function (req, res){
    var headers = serverConf['headers'];
    if(headers){
        for(var key in headers){
            if(headers.hasOwnProperty(key)){
                res.setHeader(key, headers[key]);
            }
        }
    }
    return res;
};

module.exports = Server;