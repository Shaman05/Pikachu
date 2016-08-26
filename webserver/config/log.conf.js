/**
 * Created by ChenChao on 2016/3/8.
 * 日志记录相关配置
 */

var config = {
    //日志目录
    dir: 'log',

    //级别
    level: 0,

    //单个日志最大字节
    maxSize: 1024,

    //是否只保留当天日志
    isDispose: true,

    //是否log user-agent,
    isLogUserAgent: false
};

module.exports = config;