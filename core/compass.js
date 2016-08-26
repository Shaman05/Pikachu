/**
 * Created by admin on 2016/8/26.
 */

"use strict";

var child_process = require('child_process');
var _ = require('lodash');
var config = require('../config');
var rubyCmd = config.addOn.rubyCmd;
var sassCli = config.addOn.sassCli;
var compassCli = config.addOn.compassCli;

module.exports = {
    getDefaultArgs: function (options) {
        return resolveParam(options);
    },
    check: function () {
        execCommand(`${rubyCmd} -v`, function (error) {
            console.log(error ? 'Ruby abnormal!' : 'Ruby pass!');
        });

        execCommand(`${sassCli} -v`, function (error) {
            console.log(error ? 'Sass abnormal!' : 'Sass pass!');
        });

        execCommand(`${compassCli} -v`, function (error) {
            console.log(error ? 'Compass abnormal!' : 'Compass pass!');
        });
    },

    /**
     * 使用 sass 编译
     * @param sassFile sass源文件
     * @param options 参数设定
     */
    sassCompile: function (sassFile, options) {
        var args = sassCli
            .concat([sassFile])
            .concat(resolveParam(options));
        execCommand(args, function (error, stdOut) {
            if(error){
                console.log(error);
            }
            if(stdOut){
                console.log(stdOut);
            }
        });
    },

    /**
     * 使用 compass 编译
     * @param projectSassDir compass项目根目录
     * @param options 参数设定
     */
    compassCompile: function (projectSassDir, options) {
        var args = compassCli
            .concat(['compile'])
            .concat([projectSassDir])
            .concat(resolveParam(options));
        execCommand(args, function (error, stdOut) {
            if(error){
                console.log(error);
            }
            if(stdOut){
                console.log(stdOut);
            }
        });
    }
};

function execCommand(args, callback) {
    if(!args.length === 0)return;
    var childProcess = child_process.spawn(rubyCmd, args);
    childProcess.stderr.setEncoding('utf8');
    childProcess.stderr.on('data', function (error){
        callback && callback(error, '');
    });
    childProcess.stdout.setEncoding('utf8');
    childProcess.stdout.on('data', function (data){
        callback && callback(null, data);
    });
    childProcess.on('close', function (code){
        console.log(`Process exited with code: ${code}, command exec ${code == 0 ? 'success': 'failed'}!`);
    });
}

function resolveParam(options) {
    var args = [];
    var argsMap = {
        cssDir: '--css-dir=',
        outStyle: '--output-style=',
        configFile: '--config=',
        sourceMap: '--sourcemap',
        time: '--time',
        trace: '--trace',
        force: '--force',
        sourceComments: '--no-line-comments'
    };
    options = _.extend(config.sass, options || {});
    //必传参数
    args.push(`${argsMap.outStyle}${options.outStyle}`);
    args.push(`${argsMap.cssDir}${options.cssDir}`);
    //可选参数
    options.sourceMap && args.push(argsMap.sourceMap);
    options.sourceComments && args.push(argsMap.sourceComments);
    options.configFile && args.push(argsMap.configFile);
    options.time && args.push(argsMap.time);
    options.trace && args.push(argsMap.trace);
    options.force && args.push(argsMap.force);
    return args;
}

module.exports.compassCompile('./test', {
    cssDir: './out',
    sourceMap: true,
    outStyle: 'compressed',
    trace: true,
    force: true,
    time: true
});