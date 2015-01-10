var ws = require('ws');
var setting = require('../setting');
var client = new ws(setting.server);

var listeners = {};
var queue = [];

client.on('open', function() {
    client.isOpen = true;
    client.send('Javascript');
    queue.forEach(client.send);
    client.on('message', function(message) {
        var msg = JSON.parse(message);
        if (!msg.type || !msg.data || !listeners[msg.type]) return;
        listeners[msg.type](msg.data);
    });
});

exports.on = function(type, listener) {
    listeners[type] = listener;
}

exports.emit = function(type, data, target) {
    var message = JSON.stringify({
        type : type,
        data : data,
        target : target
    });
    if (client.isOpen) {
        client.send(message);
    } else {
        queue.push(message);
    }
}