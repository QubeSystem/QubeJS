var async = require('async');
var util = require('./util');
var socket = require('./socket');

var registry = {};

exports.on = function on(event, requester, handler) {
    if (!registry[event]) {
        registry[event] = [];
    }
    registry[event].push({
        requester : requester,
        handler : handler
    });
}

function order(input) {
    if (!registry[input.event]) {
        socket.emit('ask', {
            id : input.id
        });
        return;
    }
    var requests = [];
    async.each(registry[input.event], function(each, cb) {
        each.requester(input.info, function(err, request) {
            if (err) {
                socket.emit('err', 'Error on handling event\'s data requester');
                socket.emit('err', err);
                socket.emit('err', err.stack);
                cb();
                return;
            }
            util.mergeArr(requests, request);
            cb();
        });
    }, function() {
        socket.emit('ask', {
            id : input.id,
            data : requests
        });
    });
}

function answer(input) {
    if (!registry[input.event]) {
        socket.emit('result', {
            id : input.id
        });
        return;
    }

    var datas = {};
    var events = [];
    var loads = [];
    var saves = [];

    async.eachSeries(registry[input.event], function(each, cb) {
        each.handler(input.info, input.data, function(err, output) {
            if (err) {
                socket.emit('err', 'Error on executing event handlers for event ' + input.event);
                socket.emit('err', err);
                socket.emit('err', err.stack);
                cb();
                return;
            }
            output = output || {};
            if (output.data) {
                for (var key in output.data) {
                    if (input.data[key]) {
                        datas[key] = output.data[key];
                    }
                }
            }
            if (output.event) {
                output.event.forEach(events.push);
            }
            if (output.load) {
                output.load.forEach(loads.push);
            }
            if (output.save) {
                output.save.forEach(saves.push);
            }
            cb();
        });
    }, function() {
        socket.emit('result', {
            id : input.id,
            data : datas,
            event : events,
            load : loads,
            save : saves
        });
    });
}

exports.init = function() {
    socket.on('answer', answer);
    socket.on('order', order);
}