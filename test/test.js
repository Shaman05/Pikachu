/**
 * Created by admin on 2016/8/26.
 */

var path = require('path');
var compass = require('./compass');

//compass.check();

/*compass.sassCompile(resolveFile('sass/aa.scss'), {
    out: resolveFile('out/aa.css'),
    sourceMap: true
});*/

compass.compassCompile(resolveFile('sass/'), {
    out: resolveFile('out/aa.css'),
    sourceMap: true
});

function resolveFile(file) {
    return path.join(__dirname, file);
}