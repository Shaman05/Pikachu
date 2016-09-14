/**
 * Created by ChenChao on 2016/7/29.
 */

"use strict";

var fs = require('fs');
var path = require('path');
var child_process = require('child_process');
var util = require('./util');

module.exports = {
    hasWebpack: function (projectDir) {
        return fs.existsSync(path.join(projectDir, 'webpack.config.js'));
    }
};