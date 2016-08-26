## Node Static Server

#### NSS能做什么？

N(Node)S(Static)S(Server)是用Nodejs创建web服务，并提供一组相关功能由 electron 开发的桌面应用。

* 可以任意指定的目录作为一个静态web服务的虚拟根目录
* 可配置自定义标签作为模板碎片占位符
* 可为远程接口设置代理服务，方便前后端分离的开发

#### 基本功能介绍

## 添加虚拟目录

该功能同IIS的虚拟目录，nginx的vhost，以指定的目录作为web静态站点的根目录。

##### 添加虚拟目录
![image](https://github.com/Shaman05/Node-Static-Server/blob/master/static/addvhost.png)

###### 别名(必须)
该站点的名称

###### 端口（必须）
站点占用端口号，唯一指定，不能重复

###### 目录（必须）
站点的根目录

###### 配置文件（可选，json文件）
站点配置，当前版本尚未添加相关功能

###### 模板规则文件（可选，js文件，node模块）
站点的模板规则，该规则是自由指定对html文件里特殊标签或者占位符的解析规则，每个添加的web站点都可以配置自己的模板规则。

NSS是一个通用的解决方案，当前版本内置识别 `<include file="filepath"></include>` filepath 被引用文件相对当前文件的路径。

一个简单的模板规则模块文件(site1.conf.js)代码如下：

    "use strict";
    var cssRegExp = /\{\{\{(.*?)\.css\}\}\}/ig;
    var destDir = '/dist/css/';

    module.exports = function(content){
      //添加css版本号
      var version = '?v=' + +new Date();
      return content.replace(cssRegExp, destDir + '$1.css' + version);
    }

该配置可将模板中 `{{cssfile.css}}` 替换为 `/dist/css/cssfile.css?v=xxxxxxxx`

###### 反向代理（可选）
反向代理作为前后端分离项目来讲是比较好用的配置，后端提供的API接口地址和路径可通过该项配置添加。

一个反向代理的配置，host为http://10.10.82.85, path为/api，会将路由 /api/path/to/login 代理到 http://10.10.82.85/api/path/to/login

## 虚拟目录列表

罗列出已有的虚拟目录和其一些基本信息，并提供一组操作。所有的虚拟目录存储在 /data/vhost.json 文件里。

启动该站点后，可点击访问按钮直接浏览器打开访问。详细信息可查看站点的详细情况，包括运行进程的 pid。

##### 虚拟目录列表
![image](https://github.com/Shaman05/Node-Static-Server/blob/master/static/vhostlist.png)

##### 虚拟目录信息
![image](https://github.com/Shaman05/Node-Static-Server/blob/master/static/vhostinfo.png)

## 日志

web服务的启动信息，错误信息，以及调试 console.log 信息可以在文件 /data/vhost.log 里查看， 也可通过菜单栏的日志选项打开查看。
