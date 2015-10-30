var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use('/dashboard', express.static('dashboard'));

io.on('connection', function (socket) {
    console.log("Device connected!");
});

var server = http.listen(3000, function () {
    console.log('Example app listening on port 3000');
});