var util = require('./util');
var async = require('async');

var modules = [];

exports.add = function(meta, module) {
    meta.after = meta.after || [];
    modules.push({
        meta : meta,
        module : module
    });
}

exports.execute = function(callback) {
    if (modules.length <= 0) {
        callback();
        return;
    }
    var outputs = {};
    var resultsNames = [];
    var names = util.childArr(util.childArr(modules, 'meta'), 'name');

    var count = 0;
    async.whilst(function() {
        return modules.length > 0;
    }, function(cb) {
        if (++count > names.length * 3) throw new Error('Circular dependencies detected... I guess');

        var module1 = modules.shift();
        var args = {};
        for (var i in module1.meta.after) {
            var each = module1.meta.after[i];
            if (resultsNames.indexOf(each) < 0 && names.indexOf(each) >= 0) {
                modules.push(module1);
                cb();
                return;
            }
            args[each] = outputs[each];
        }
        module1.module(args, function(output) {
            outputs[module1.meta.name] = output;
            cb();
        });
    }, callback);
}