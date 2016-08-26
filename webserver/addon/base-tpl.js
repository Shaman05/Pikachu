/**
 * Created by ChenChao on 2016/7/8.
 */


"use strict";

var fs = require('fs');
var path = require('path');
var config = require('../config/server.conf');

var duxTpl = require('./dux-tpl');
var renderPlugs = [duxTpl];

module.exports = function(content, filePath){
    renderPlugs.forEach(function(fn, index){
        if(typeof fn === 'function'){
            content = fn(content);
        }
    });

    content = execInclude(content, filePath);
    return content;
};

//include功能
function execInclude(content, filePath){
    var includes;
    while((includes = config.includeRegExp.exec(content)) !== null){
        var file = includes[1];
        var currentPath = path.dirname(path.join(path.resolve(process.cwd(), filePath)));
        var fileContent = fs.readFileSync(path.join(currentPath, file), 'utf-8');
        content = content.replace(config.includeRegExp, fileContent);
    }
    return content;
}