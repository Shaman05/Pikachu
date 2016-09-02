/**
 * Created by ChenChao on 2016/3/8.
 * 创建web服务的相关配置
 */

var baseConfig = require('../../config');
nssConf = baseConfig.nss || {};

var env = 'dev';

var config = {
    env: env,

    //协议类型
    protocol: 'http',

    //端口
    port: '',

    //附加头信息
    headers: function () {
        var headers = {
            'X-Server': 'Node',
            'X-Power-By': 'Pikachu Nss/1.0'
        };
        if(nssConf.crossDomain){
            headers['Access-Control-Allow-Origin'] = '*';
        }
        return headers;
    }(),

    //mime type
    mimeType: {
        'txt': 'text/plain; charset=utf-8',
        'php': 'text/plain; charset=utf-8',
        'log': 'text/plain; charset=utf-8',
        'md': 'text/plain; charset=utf-8',
        'html': 'text/html; charset=utf-8',
        'css': 'text/css; charset=utf-8',
        'xml': 'application/xml; charset=utf-8',
        'json': 'application/json; charset=utf-8',
        'js': 'application/javascript; charset=utf-8',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'gif': 'image/gif',
        'png': 'image/png',
        'svg': 'image/svg+xml'
    },

    fileSuffix: {
        'html': 'html',
        'shtml': 'html',
        'htm': 'html',
        'ejs': 'html',
        'tpl': 'html',
        'js': 'js',
        'scss': 'sass',
        'css': 'css',
        'png': 'image',
        'jpg': 'image',
        'jpeg': 'image',
        'gif': 'image',
        'bmp': 'image',
        'file': 'file',
        'rar': 'zip',
        'rar5': 'zip',
        'zip': 'zip'
    },

    //html content
    contentType: {
        'Content-Type': 'text/html; charset=utf-8'
    },

    //默认显示页面
    defaultPagePattern: nssConf.defaultPage && /index123\.html/,

    titleRegExp: /<title>(.*?)<\/title>/i,

    //是否默认支持 html 文件夹
    metaHtml: true,

    //静态资源目录查看
    staticDir: ['source', 'static', 'template'],

    //static files
    jsSource: env == 'dev' ? '/source/.build/js' : '/static/js',
    cssSource: env == 'dev' ? '/source/.build/css' : '/static/css',
    imgSource: env == 'dev' ? '/source/static/images' : '/static/images',

    includeRegExp: /<include\s+file=\"(.*?)\"><\/include>/

};

module.exports = config;