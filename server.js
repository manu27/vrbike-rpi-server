global.__base = __dirname + '/';
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var config = require(__base + 'config/default');
var speedService = require('./services/speed');
var steeringService = require('./services/steering');

global.keyControls = false;

app.use('/dashboard', express.static(__base + 'dashboard'));
app.post('/keycontrols', function (req, res) {
    global.keyControls = !global.keyControls;
    res.json({
        keyControls: global.keyControls
    });
});

// Set onValueChange functions to emit new values to sockets
speedService.onAccelerationChange = function (acceleration) {
    console.log(acceleration);
    io.emit('acceleration', {
        acceleration: acceleration
    });
};
steeringService.onSteeringAngleChange = function (angle) {
    console.log(angle);
    io.emit('steering', {
        angle: angle
    });
};

// Init and start
steeringService.initializeAndStart();

// Listen to key events for manual controls of the bike
io.on('connection', function (socket) {
    console.log((socket.handshake.query.name ? socket.handshake.query.name : 'Device') + " connected!");

    socket.on('key-forward', function (data) {
        speedService.setCurrentAcceleration(config.speed.manual.acceleration * data);
    });
    socket.on('key-backward', function (data) {
        speedService.setCurrentAcceleration(config.speed.manual.deacceleration * data);
    });
    socket.on('key-left', function (data) {
        steeringService.setCurrentSteeringAngle(-config.steering.manual.maxAngle * data);
    });
    socket.on('key-right', function (data) {
        steeringService.setCurrentSteeringAngle(config.steering.manual.maxAngle * data);
    });
});

// Start server on port 3000
var server = http.listen(3000, function () {
    console.log('VR Bike server listening on port 3000!');
});