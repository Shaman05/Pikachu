/**
 * Created by ChenChao on 2016/7/25.
 */

"use strict";

var path = require('path');
var fs = require('fs');
var config = require('../config');
var logFile = config.logFile;

module.exports = {
    info: function (content, line, isErr) {
        if(line){
            content = content + '\r\n';
        }else{
            content = [
                new Date(),
                content,
                '\r\n'
            ].join('\r\n');
        }
        if(isErr){
            content = '--------Error--------\r\n' + content;
            content = content + '--------End error--------\r\n\r\n';
        }
        fs.appendFile(logFile, content, function (err) {});
    }
};