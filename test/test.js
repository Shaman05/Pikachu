/**
 * Created by admin on 2016/8/26.
 */

var path = require('path');
var compass = require('../core/compass');

//compassCheck();

//testCompass();

testSass();



function compassCheck() {
    compass.getRubyVersion(function (versionInfo, code) {
        console.log(versionInfo);
    });
    compass.getSassVersion(function (versionInfo, code) {
        console.log(versionInfo);
    });
    compass.getCompassVersion(function (versionInfo, code) {
        console.log(versionInfo);
    });
}

function testSass(){
    console.log('start test: sass compile');
    compass.sassCompile(resolveFile('./sass/aa.scss'), {
        cssFile: resolveFile('./out/xxxx.css'),
        sourceMap: false,
        force: true,
        outStyle: 'compact'
    }, function (code) {
        console.log('cass compile test completed! exit code: ' + code);
    });
}

function testCompass() {
    console.log('start test: compass compile');
    compass.compassCompile(resolveFile('./'), {
        cssDir: resolveFile('./out'),
        sourceMap: false,
        outStyle: 'compact',
        trace: true,
        force: true,
        time: true
    }, function (code) {
        console.log('compass compile test completed! exit code: ' + code);
    });
}

function resolveFile(file) {
    return path.join(__dirname, file);
}