var express = require('express');
var app = express();

app.use('/dashboard', express.static('dashboard'));

var server = app.listen(3000, function () {
    console.log('Example app listening on port 3000');
});