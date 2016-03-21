var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var config = require('config');
var speedService = require('./services/speed');
var steeringService = require('./services/steering');

global.keyControls = false;

app.use('/dashboard', express.static('dashboard'));
app.post('/keycontrols', function (req, res) {
    global.keyControls = !global.keyControls;
    res.json({
        keyControls: global.keyControls
    });
});

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

io.on('connection', function (socket) {
    console.log("Device connected!");

    socket.on('key-forward', function (data) {
        speedService.setCurrentAcceleration(config.get('speed.manual.acceleration') * data);
    });
    socket.on('key-backward', function (data) {
        speedService.setCurrentAcceleration(config.get('speed.manual.deacceleration') * data);
    });
    socket.on('key-left', function (data) {
        steeringService.setCurrentSteeringAngle(-config.get('steering.manual.maxAngle') * data);
    });
    socket.on('key-right', function (data) {
        steeringService.setCurrentSteeringAngle(config.get('steering.manual.maxAngle') * data);
    });
});

var server = http.listen(3000, function () {
    console.log('Example app listening on port 3000');
});