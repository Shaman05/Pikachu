/**
 * Created by ChenChao on 2016/5/26.
 */

var Server = require('./core/Server');
var Servlet = require('./core/Servlet');

module.exports = function(){
    return new Server({
        'GET' : new Servlet(),
        'POST': new Servlet(),
        'HEAD': new Servlet()
    });
};