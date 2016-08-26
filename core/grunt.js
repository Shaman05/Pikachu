/**
 * Created by admin on 2016/7/29.
 */

"use strict";

var fs = require('fs');
var path = require('path');
var child_process = require('child_process');
var util = require('../common/util');

module.exports = {
    hasGrunt: function (projectDir) {
        return fs.existsSync(path.join(projectDir, 'Gruntfile.js')) || fs.existsSync(path.join(projectDir, 'Gruntfile.coffee'));
    },

    getGruntTask: function (projectDir) {
        var task = [];
        var fileName = 'Gruntfile.coffee';
        if(fs.existsSync(path.join(projectDir, 'Gruntfile.js'))){
            fileName = 'Gruntfile.js';
        }
        if(this.hasGrunt(projectDir)){
            var content = fs.readFileSync(path.join(projectDir, fileName), 'utf-8');
            var re = /grunt\.registerTask.*?\((.*?)\)/ig;
            var result = '';
            while (result = re.exec(content)) {
                task.push(result[1]);
            }
        }
        return parseTask(task);
    }
};

function parseTask(task) {
    var result = [];
    if(task.length > 0){
        task.forEach(function (item, index) {
            var a = item.replace(/['|"|\[|\]|\s]/g, '').split(',');
            var taskName = a.shift();
            result.push({
                taskName: taskName,
                subTask: a
            });
        })
    }
    return result.sort(sortRule);
}

function sortRule(a, b) {
    if(a.taskName > b.taskName){
        return 1;
    }
    if(a.taskName < b.taskName){
        return -1;
    }
    return 0;
}