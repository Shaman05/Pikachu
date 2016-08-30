## 欢迎使用 Pikachu!

#### Pikachu 是用来做什么的？

1.  web server 静态文件服务器

    你可以将你的前端项目添加到 pikachu 里，简单配置后即可以启动一个支持预览 .html 文件的静态的 web server， 其他类型文件，将以对应的 mime type 返回， 服务的根目录即为添加项目的目录。  [点击添加新项目](javascript:)

2.  模板解析

    pikachu 启动的静态 web server 默认支持 <include file="path/to/file"></include> 等语法（[详情参考](javascript:)）， 同时也支持自定义模板标签，该规则是自由指定对 .html 文件里特殊标签或者占位符的解析规则，不同的项目可以配置自己的模板规则。

3.  反向代理

    此功能在前后端完全分离的项目中很有用，它允许你配置反向代理的主机地址和对应的 path 路径，在项目中以该 path 开头的请求会由配置的主机返回响应， 该功能可在项目设置中自由开关。
    一个反向代理的配置 host 为 http://10.10.82.85, path 为 /api，会将路由 /api/path/to/login 代理到 http://10.10.82.85/api/path/to/login。

4.  gulp、grunt、webpack任务一键运行

    基于目前前端项目的工程化，pikachu 针对构建工具 gulp, grunt, webpack 的对应配置文件 gulpfile.js, Gruntfile.js, webpack.config.js 自动解析 其中的任务和依赖，并提供需要参数的输入一键运行任务。

5.  sass、compass一键编译

    对于非工程化的前端项目，目前 pikachu 支持 sass（未考虑加入less、coffeescript） 文件编译。
     pikachu 会自动扫描项目中的 .scss 源文件并提供相应的配置来帮助你编译该文件，如：是否输出 source map，输出格式等选项，而这些均为可视化的操作。

6.  还有什么？

    上面几点是 pikachu 的主要功能，还有其他一些小功能都很贴心的，这里不一一列出了，详情可查看[这里](javascript:)。
     前端开发在现今越来越重要了，也越来越复杂了，在开发过程中你还需要什么样的功能希望 pikachu 来帮助你呢？ [我要提建议和反馈](javascript:)

#### pikachu 客户端开发使用的技术

1.  electron

    其实最初使用过 nw.js 开发过一个前端助手的工具，还没有发布就夭折了（555~~~）。当初因为 windows 环境问题，被折腾的痛苦不堪。后来接触到 electron， 在目前公司前端组里的项目管理上遇到些实际问题，于是开始着手开发 pikachu，在使用 electron 过程中，再也没有碰到众多的环境问题了，文档也很详细，泪流满面。

2.  Vue.js

    同上提到的前端助手工具，业务逻辑使用的是 Angular.js（之前 Vue.js 还没问世），在实际项目中我们开始使用 Vue.js 了，开发过程中最大的感受是 Vue.js 简单易用， 该有的功能都有，编写业务 js 代码可以很简洁，简单粗暴，所以这次选用了 Vue.js 来开发 pikachu。
