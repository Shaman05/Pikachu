/**
 * Created by ChenChao on 2016/7/18.
 */

"use strict";

var util = require('../../../common/util');

module.exports = function () {
    return Vue.extend({
        template: util.template('setting.html'),
        methods: {
            pathTo: util.pathTo
        }
    });
};