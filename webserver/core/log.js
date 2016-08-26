/**
 * Created by ChenChao on 2016/3/8.
 * 日志记录模块
 */

var _FS_ = require('fs');
var _PATH_ = require('path');

var logConf = require('../config/log.conf');
var logDir = _PATH_.resolve(__dirname, '..', logConf.dir);
var level = 0;
var maxSize = 1024;  //todo
var logIndex = 0; //用来创建大于 maxSize 大小后日志文件名称的索引值

module.exports = {
  config: function(options){
    if(!_FS_.existsSync(logDir)){
      _FS_.mkdirSync(logDir);
    }
    level = options.level || logConf.level;
    maxSize = options.maxSize || logConf.maxSize;
  },

  write: function(content){
    if(level === 0){
      return;
    }
    var logFile = createLogFileByDate();
    var writeString = [
      '\r\n',
      '[' + new Date().toLocaleString() + ']',
      content
    ].join('');
    _FS_.appendFile(logFile, writeString, {
      encoding: 'utf8'
    }, function(err) {
      if(err){
        throw err;
      }
    });
  },

  writeAgent: function(content){
    if(!logConf.isLogUserAgent){
      return;
    }
    this.write(content);
  },

  dispose: function(){
    if(!logConf.isDispose){
      return;
    }
    var logFile = createLogFileByDate();
    _FS_.readdir(logDir, function(err, files){
      if(!err){
        for(var i = 0; i < files.length; i++){
          var file = _PATH_.join(logDir, files[i]);
          if(file !== logFile){
            _FS_.unlinkSync(file);
          }
        }
      }
    });
  }
};

function createLogFileByDate(){
  var date = new Date().toLocaleDateString();
  return _PATH_.join(logDir, date + '.log');
}