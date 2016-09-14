/**
 * Created by ChenChao on 2016/8/26.
 */

"use strict";

var child_process = require('child_process');
var _ = require('lodash');
var log = require('./log');
var config = require('../config');
var rubyCmd = config.addOn.rubyCmd;
var sassCli = config.addOn.sassCli;
var compassCli = config.addOn.compassCli;

//自定义一个非进程结束的 code 值
var runningCode = -110;

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
    
    getRubyVersion: function (cb) {
        var args = ['-v'];
        execCommand(args, function (error, stdOut, code) {
            if(code !== runningCode){
                console.log(code == 0 ? 'Ruby pass!' : 'Ruby abnormal!');
                cb(stdOut, code);
            }
        });
    },

    getSassVersion: function (cb) {
        var args = sassCli.concat(['-v']);
        execCommand(args, function (error, stdOut, code) {
            if(code !== runningCode){
                console.log(code == 0 ? 'Sass pass!' : 'Sass abnormal!');
                cb(stdOut, code);
            }
        });
    },

    getCompassVersion: function (cb) {
        var args = compassCli.concat(['-v']);
        execCommand(args, function (error, stdOut, code) {
            if(code !== runningCode){
                console.log(code == 0 ? 'Compass pass!' : 'Compass abnormal!');
                cb(stdOut, code);
            }
        });
    },

    /**
     * 使用 sass 编译
     * @param sassFile sass源文件
     * @param options 参数设定
     */
    sassCompile: function (sassFile, options, cb) {
        delete options.cssDir;
        var argsMap = {
            outStyle: '--style=',
            sourceMap: `--sourcemap=${options.sourceMap ? 'auto' : 'none'}`,
            trace: '--trace',
            force: '--force',
            sourceComments: '--line-comments'
        };
        var args = sassCli
            .concat([sassFile])
            .concat([options.cssFile])
            .concat(resolveParam(argsMap, options));
        execCommand(args, callback(cb));
    },

    /**
     * 使用 compass 编译
     * @param projectSassDir compass项目根目录
     * @param options 参数设定
     */
    compassCompile: function (projectSassDir, options, cb) {
        var argsMap = {
            cssDir: '--css-dir=',
            outStyle: '--output-style=',
            configFile: '--config=',
            sourceMap: `--${options.sourceMap ? '' : 'no-'}sourcemap`,
            time: '--time',
            trace: '--trace',
            force: '--force',
            sourceComments: '--no-line-comments'
        };
        var args = compassCli
            .concat(['compile'])
            .concat([projectSassDir])
            .concat(resolveParam(argsMap, options));
        execCommand(args, callback(cb));
    }
};

function callback(cb) {
    return function (error, stdOut, code, duration) {
        if(error){
            console.log(error);
        }
        if(stdOut){
            console.log(stdOut);
        }
        if(code !== runningCode){
            var logMsg = `Process exited with code: ${code}, command exec ${code == 0 ? 'success': 'failed'}!`;
            console.log(logMsg);
            log.info(logMsg);
            cb(code, duration);
        }else{
            console.log(`Process running exception!`);
            cb(code, '', error);
        }
    }
}

function execCommand(args, callback) {
    if(!args.length === 0)return;
    var startTime = +new Date();
    var outPut = '';
    var childProcess = child_process.spawn(rubyCmd, args);
    log.info(['exec command:', args.join(' ')].join('\r\n'));
    childProcess.stderr.setEncoding('utf8');
    childProcess.stderr.on('data', function (error){
        callback && callback(error, '', runningCode);
    });
    childProcess.stdout.setEncoding('utf8');
    childProcess.stdout.on('data', function (data){
        outPut += data;
        callback && callback(null, data, runningCode);
    });
    childProcess.on('close', function (code){
        var duration = +new Date() - startTime;
        callback && callback(null, outPut, code, duration);
    });
}

function resolveParam(argsMap, options) {
    var args = [];
    options = _.extend(config.sass, options || {});
    //必传参数
    args.push(`${argsMap.outStyle}${options.outStyle}`);
    args.push(argsMap.sourceMap);
    //可选参数
    options.cssDir && args.push(`${argsMap.cssDir}${options.cssDir}`);
    options.sourceComments && args.push(argsMap.sourceComments);
    options.configFile && args.push(argsMap.configFile);
    options.time && args.push(argsMap.time);
    options.trace && args.push(argsMap.trace);
    options.force && args.push(argsMap.force);
    return args;
}