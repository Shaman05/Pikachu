/**
 * Created by ChenChao on 2016/5/30.
 */


var config = require('../config/server.conf');
var jsRegexp = /\{\{jsSource\}\}/ig;
var cssRegexp = /\{\{cssSource\}\}/ig;
var imgRegexp = /\{\{imgSource\}\}/ig;

module.exports = function(content){
    return content
        .replace(cssRegexp, config.cssSource)
        .replace(jsRegexp, config.jsSource)
        .replace(imgRegexp, config.imgSource);
};