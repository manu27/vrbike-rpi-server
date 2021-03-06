global.__base = __dirname + '/';
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var exec = require('child_process').exec;
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

app.post('/shutdown', function (req, res) {
    exec("sudo shutdown -h now", function (error, stdout, stderr) {
        res.end("Shutdown...");
    });
});

// Set onValueChange functions to emit new values to sockets
speedService.onRPMChange = function (rpm, value) {
    console.log("RPM: ", rpm, " Value: ", value);
    io.emit('speed', {
        rpm: rpm,
        value: value
    });
};
steeringService.onSteeringAngleChange = function (angle) {
    console.log(angle);
    io.emit('steering', {
        angle: angle
    });
};

// Init and start
steeringService.initializeAndStart(config.steering);
speedService.initializeAndStart(config.speed);

// Listen to key events for manual controls of the bike
io.on('connection', function (socket) {
    // TODO send current values
    console.log((socket.handshake.query.name ? socket.handshake.query.name : 'Device') + " connected!");

    socket.on('key-controls', function (data) {
        console.log(data);
        if (!data.type) data.type = 'forward';
        if (data.type == 'forward') {
            speedService.setCurrentRPM(config.speed.max.rpm * data.value);
        }
        if (data.type == 'backward') {
            speedService.setCurrentRPM(-config.speed.max.rpm * data.value);
        }
        if (data.type == 'left') {
            steeringService.setCurrentSteeringAngle(-config.steering.manual.maxAngle * data.value);
        }
        if (data.type == 'right') {
            steeringService.setCurrentSteeringAngle(config.steering.manual.maxAngle * data.value);
        }
    });
});

// Start server on port 3000
var server = http.listen(3000, function () {
    console.log('VR Bike server listening on port 3000!');
});