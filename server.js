var express = require('express');
var app = express();
var io = require('socket.io')(app);

app.use('/dashboard', express.static('dashboard'));

io.on('connection', function (socket) {
    console.log("Device connected!");
});

var server = app.listen(3000, function () {
    console.log('Example app listening on port 3000');
});