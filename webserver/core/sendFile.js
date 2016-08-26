/**
 * Created by ChenChao on 2016/3/8.
 * 发送文件内容模块
 */

var _FS_ = require('fs');
var tplRender = require('../addon/base-tpl');

module.exports = {
    html: function (req, res, path, tplRule){
        _FS_.readFile(path, 'utf-8', function (err, content){
            var _content = tplRender(content, path);
            _content = tplRule(_content);
            res.end(_content);
        });
    },

    others: function (){
    }
};