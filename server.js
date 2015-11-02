var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var config = require('config');
var speedSensor = require('./services/speed');

speedSensor.initialize(config.get('speed'));

app.use('/dashboard', express.static('dashboard'));

io.on('connection', function (socket) {
    console.log("Device connected!");

    socket.interval = setInterval(function () {
        socket.emit('speed', {
            kmPerHour: speedSensor.getCurrentSpeed()
        });
    }, 100);
});

var server = http.listen(3000, function () {
    console.log('Example app listening on port 3000');
});