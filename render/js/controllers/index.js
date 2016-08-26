/**
 * Created by ChenChao on 2016/7/18.
 */

"use strict";

var marked = require('marked');
var util = require('../../../common/util');

module.exports = function () {
    return Vue.extend({
        data: function () {
            return {
                loaded: false,
                content: ''
            };
        },
        template: util.template('index.html'),
        created: function () {
            this.$parent.appLoading = true;
            this.content = marked(util.getReadMe());
            this.loaded = true;
            this.$parent.appLoading = false;
        },
        methods: {
            pathTo: util.pathTo
        }
    });
};