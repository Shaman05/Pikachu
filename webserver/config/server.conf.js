/**
 * Created by ChenChao on 2016/3/8.
 * 创建web服务的相关配置
 */

var env = 'dev';

var config = {
    env: env,

    //协议类型
    protocol: 'http',

    //端口
    port: '',

    //附加头信息
    headers: {
        'Access-Control-Allow-Origin': '*',
        'X-Server': 'Node v8',
        'X-Power-By': 'Nss/1.0'
    },

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

    //html content
    contentType: {
        'Content-Type': 'text/html; charset=utf-8'
    },

    //默认显示页面
    defaultPagePattern: /index22\.html/,

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