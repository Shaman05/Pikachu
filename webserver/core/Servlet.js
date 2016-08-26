/**
 * Created by ChenChao on 2016/3/8.
 * 处理请求的类
 */

var _FS_ = require('fs');
var _PATH_ = require('path');
var _URL_ = require('url');
var _JUICER_ = require('juicer');
var _MIME_ = require('mime');

var proxy = require('./proxy');
var sendFile = require('./sendFile');
var log = require('./log');
var serverConf = require('../config/server.conf');
var tplPath = _PATH_.resolve(__dirname, '..', 'template');
var defaultPagePattern = serverConf['defaultPagePattern'];
var displayOption = serverConf['contentType'];
var staticDir = serverConf['staticDir'];

var proxyHost = process.argv[3];
var proxyPath = process.argv[4];
var configFile = process.argv[5];
var configTpl = process.argv[6];
var useCache = process.argv[7];
var extendConf = {
    proxyHost: proxyHost == 'none' ? null : proxyHost,
    proxyPath: proxyPath == 'none' ? null : proxyPath,
    conf: configFile == 'none' ? {} : require(configFile),
    tplRule: configTpl == 'none' ? function(content){return content;} : require(configTpl),
    useCache: !(useCache == 'none')
};
var proxyPathRegExp = new RegExp('^.\\' + extendConf.proxyPath + '\\/(.*?)$');

function Servlet(method){
    this.method = method;
    return this.handleRequest.bind(this);
}

Servlet.prototype.handleRequest = function (req, res){
    var self = this;
    req.url.pathname = decodeURIComponent(req.url.pathname);
    var path = ('./' + req.url.pathname).replace('//', '/').replace(/%(..)/g, function (match, hex){
        return String.fromCharCode(parseInt(hex, 16));
    });
    var parts = path.split('/');
    if(parts[parts.length - 1].charAt(0) === '.'){
        return self.forbidden(req, res, path);
    }
    if(proxyPathRegExp.test(path)){
        return proxy.proxy(req, res, extendConf.proxyHost);
    }
    _FS_.stat(path, function (err, stat){
        if(err){
            return self.missing(req, res, path);
        }
        if(stat.isDirectory()){
            return self.directory(req, res, path);
        }
        return self.sendFile(req, res, path);
    });
};

Servlet.prototype.directory = function (req, res, path){
    var self = this;
    var isHtmlDir = false;
    if(serverConf.metaHtml){
        isHtmlDir = path.split('/');
        isHtmlDir = isHtmlDir[isHtmlDir.length - 2].toLowerCase() === 'html';
    }
    if(path.match(/[^\/]$/)){
        req.url.pathname += '/';
        var redirectUrl = _URL_.format(_URL_.parse(_URL_.format(req.url)));
        return self.redirect(req, res, redirectUrl);
    }
    _FS_.readdir(path, function (err, files){
        if(err){
            return self.error(req, res, err);
        }
        if(!files.length){
            return self.directoryIndex(req, res, path, [], isHtmlDir);
        }
        var remaining = files.length;
        files.forEach(function (fileName, index){
            if(fileName.match(defaultPagePattern)){
                self.sendFile(req, res, path + fileName);
            }else{
                _FS_.stat(path + '/' + fileName, function (err, stat){
                    if(err){
                        return self.error(req, res, err);
                    }
                    if(stat.isDirectory()){
                        files[index] = fileName + '/';
                    }
                    if(!(--remaining)){
                        return self.directoryIndex(req, res, path, files, isHtmlDir);
                    }
                });
            }
        });
    });
};

//发送文件夹页面
Servlet.prototype.directoryIndex = function (req, res, path, files, isHtmlDir){
    var _files = files;
    path = path.substring(1);
    res.writeHead(200, displayOption);
    if(req.method === 'HEAD'){
        res.end();
        return;
    }
    _FS_.readFile(_PATH_.join(tplPath, 'directory.html'), {encoding: 'utf8'}, function (err, content){
        if(err){
            throw err;
        }
        res.write(_JUICER_(content, {
            dir: escapeHtml(path),
            files: _files
        }));
        res.end();
    });
};

//访问文件
Servlet.prototype.sendFile = function (req, res, path){
    var fileType = path.split('.').pop();
    var self = this;
    res.writeHead(200, {
        'Content-Type': _MIME_.lookup(fileType)
    });
    if(fileType === 'html'){
        sendFile.html(req, res, path, extendConf.tplRule);
    }else{
        var file = _FS_.createReadStream(path);
        if(req.method === 'HEAD'){
            res.end();
        }else{
            file.on('data', res.write.bind(res));
            file.on('close', function (data){
                res.end();
            });
            file.on('error', function (error){
                self.error(req, res, error);
            });
        }
    }
};

//重定向
Servlet.prototype.redirect = function (req, res, redirectUrl){
    res.writeHead(301, {
        'Content-Type': 'text/html',
        'Location': redirectUrl
    });
    _FS_.readFile(_PATH_.join(tplPath, 'redirect.html'), {encoding: 'utf8'}, function (err, content){
        if(err){
            throw err;
        }
        res.write(_JUICER_(content, {
            url: redirectUrl
        }));
        res.end();
    });
    log.write('301 Moved Permanently: ' + redirectUrl);
};

//403
Servlet.prototype.forbidden = function (req, res, path){
    path = path.substring(1);
    res.writeHead(403, displayOption);
    _FS_.readFile(_PATH_.join(tplPath, 'error_403.html'), {encoding: 'utf8'}, function (err, content){
        if(err){
            throw err;
        }
        res.write(_JUICER_(content, {
            path: escapeHtml(path)
        }));
        res.end();
    });
    log.write('403 Forbidden: ' + path);
};

//404
Servlet.prototype.missing = function (req, res, path){
    path = path.substring(1);
    res.writeHead(404, displayOption);
    _FS_.readFile(_PATH_.join(tplPath, 'error_404.html'), {encoding: 'utf8'}, function (err, content){
        if(err){
            throw err;
        }
        res.write(_JUICER_(content, {
            path: escapeHtml(path)
        }));
        res.end();
    });
    log.write('404 Not Found: ' + path);
};

//发送错误信息页面
Servlet.prototype.error = function (req, res, error){
    res.writeHead(500, displayOption);
    _FS_.readFile(_PATH_.join(tplPath, 'error_500.html'), {encoding: 'utf8'}, function (err, content){
        if(err){
            throw err;
        }
        res.write(_JUICER_(content, {
            error: escapeHtml(util.inspect(error))
        }));
        res.end();
    });
    log.write('500 Internal Server Error:\r\n' + util.inspect(error));
};

function escapeHtml(string){
    return string.toString().
    replace('<', '&lt;').
    replace('>', '&gt;').
    replace('"', '&quot;');
}

module.exports = Servlet;