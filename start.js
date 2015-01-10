process.on('uncaughtException', function(err) {
    console.error('ERROR!!!!!!!', err, err.stack);
});

var fs = require('fs');
var sorter = require('./util/sorter');
var event = require('./util/event');
var packages = fs.readdirSync('./package');

packages.forEach(function(each) {
    require('./package/' + each + '/main');
});

sorter.execute(function() {
    event.init();
});