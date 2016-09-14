/**
 * Created by ChenChao on 2016/7/29.
 */

"use strict";

var fs = require('fs');
var path = require('path');
var child_process = require('child_process');
var util = require('./util');

module.exports = {
    hasGulp: function (projectDir) {
        return fs.existsSync(path.join(projectDir, 'gulpfile.js'));
    },
    
    hasCompass: function(sassRoot){
        return fs.existsSync(path.join(sassRoot, 'config.rb'));
    },

    getGulpTask: function(projectDir){
        var task = [];
        if(this.hasGulp(projectDir)){
            var content = fs.readFileSync(path.join(projectDir, 'gulpfile.js'), 'utf-8');
            var re = /gulp\.task.*?\(.*?['|"](.*?)['|"]/ig;
            var result = '';
            while (result = re.exec(content)) {
                task.push(result[1]);
            }
        }
        return task;
    }
};