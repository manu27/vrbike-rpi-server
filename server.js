var express = require('express');
var app = express();
var gpio = require('pi-gpio');

app.get('/', function (req, res) {
    gpio.open(22, "input", function(err) {
        gpio.read(22, function (err, value) {
            if (err) throw err;
            console.log(value); // The current state of the pin
            res.send(value);
        });
    });
});

var server = app.listen(3000, function () {

    console.log('Example app listening on port 3000');
});