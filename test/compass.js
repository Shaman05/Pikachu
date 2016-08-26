/**
 * Created by admin on 2016/8/2.
 */


var child_process = require('child_process');
var exec = child_process.exec;
var config = require('../config');
var rubyCmd = config.addOn.rubyCmd;
var sassCli = config.addOn.sassCli;
var compassCli = config.addOn.compassCli;

module.exports = {
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
    
    compile: function (sassFile, options) {
        execCommand(`${sassCli} ${sassFile} ${options.out}`, function (error) {
            console.log(error ? `Compile ${sassFile} failed!` : `Compile ${sassFile} success!`);
        });
    }
};

function execCommand(command, callback) {
    if(!command)return;
    exec(command, function(error, stdout, stderr){
        if(error !== null){
            console.log(error);
            callback && callback(error);
        }else{
            //console.log(stdout);
            callback && callback(null);
        }
        if(stderr){
            console.log('stderr:\r\n' + stderr);
        }
    });
}