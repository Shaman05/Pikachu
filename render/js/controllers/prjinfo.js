/**
 * Created by ChenChao on 2016/7/18.
 */

"use strict";

var child_process = require('child_process');
var util = require('../../../core/util');
var gulp = require('../../../core/gulp');
var grunt = require('../../../core/grunt');
var sass = require('../../../core/sass');
var sassMenu = require('../menus/sassmenu');
var electron = require('electron');
var remote = electron.remote;
var config = require('../../../config');
var sassConf = config.sass;

module.exports = function () {
    return Vue.extend({
        data: function () {
            return {
                id: '',
                prjInfo: {},
                curTab: 'baseInfo',
                curTaskTab: 'gulp',

                //gulp
                gulpList: [],
                gulpTaskName: '',
                gulpParam: '',
                gulpTaskIsRunning: false,

                //grunt
                gruntList: [],
                gruntTaskName: '',
                gruntParam: '',
                gruntTaskIsRunning: false,

                //webpack
                webpackList: [],

                //sass
                isScanning: false,
                sassFiles: [],
                scanTime: 0,
                sassFileSearch: '',
                selectSass: '',
                unShowStartWidth_: true
            };
        },
        created: function () {
            this.id = this.$route.params.id;
            this.prjInfo = util.getHostInfo(this.id);
            this.gulpList = gulp.getGulpTask(this.prjInfo.path).sort();
            this.gruntList = grunt.getGruntTask(this.prjInfo.path);
            this.scanSassFile();
        },
        template: util.template('prjinfo.html'),
        computed: {
            gulpTask: function () {
                return !this.gulpTaskName ? null : ['gulp', this.gulpTaskName, this.gulpParam].join(' ');
            },
            gruntTask: function () {
                return !this.gruntTaskName ? null : ['grunt', this.gruntTaskName.taskName, this.gruntParam].join(' ');
            }
        },
        methods: {
            returnTo: function () {
                util.pathTo('/prjList', {prjName: this.prjInfo.name});
            },
            tab: function (name) {
                this.curTab = name;
            },
            taskTab: function (name) {
                this.curTaskTab = name;
            },
            visitSite: function (){
                util.openUrl('http://localhost:' + this.prjInfo.port);
            },
            setGulpTask: function (taskName) {
                this.gulpTaskName = taskName;
            },
            setGruntTask: function (taskName) {
                this.gruntTaskName = taskName;
            },
            runGulpTask: function () {
                var _this = this;
                _this.gulpTaskIsRunning = true;
                // util.console('[' + new Date().toLocaleTimeString() + '] 启动任务: <span class="console-task-name">' + this.gulpTask + '</span>');
                util.consoleTask('启动 gulp 任务', this.gulpTask);
                util.runTask(this.prjInfo.path, this.gulpTask, function (err) {
                    _this.gulpTaskIsRunning = false;
                });
            },
            runGruntTask: function () {
                var _this = this;
                _this.gruntTaskIsRunning = true;
                //util.console('[' + new Date().toLocaleTimeString() + '] 启动任务: <span class="console-task-name">' + this.gruntTask + '</span>');
                util.consoleTask('启动 grunt 任务', this.gruntTask);
                util.runTask(this.prjInfo.path, this.gruntTask, function (err) {
                    _this.gruntTaskIsRunning = false;
                });
            },
            scanSassFile: function () {
                var _this = this;
                var startTime = +new Date();
                _this.isScanning = true;
                _this.sassFiles = [];
                sass.scanFile(this.prjInfo.path, function (files) {
                    _this.scanTime = +new Date() - startTime;
                    _this.isScanning = false;
                    files.forEach(function (file, index) {
                        var cacheFile = util.ls.get(file.fullPath);
                        var sourceFile = cacheFile || {
                                cssDir: file.path,
                                sourceMap: sassConf.sourceMap,
                                sourceComments: sassConf.sourceComments,
                                outStyle: sassConf.outStyle,
                                watch: sassConf.watch
                            };
                        file = util.extend(file, sourceFile);
                        _this.sassFiles.push(file);
                        util.ls.set(file.fullPath, file);
                    });
                });
            },
            selectSassFile: function (file) {
                this.selectSass = file.fullPath;
            },
            setOurDir: function (file) {
                util.setSassOurDir(file);
            },
            popSassMenu: function (e, file) {
                this.selectSassFile(file);
                setTimeout(function () {
                    sassMenu(file).popup(remote.getCurrentWindow());
                }, 100);
            },
            compileSass: function (file) {
                sass.compile(file, 'sass');
            }
        }
    });
};