var PythonShell = require('python-shell');
//var readPoti = new PythonShell(__base + 'python/readPotentiometer.py', { args: [0], mode: 'text' });
var config = require(__base + 'config/default');
var sys = require('sys');
var spawn = require('child_process').spawn;
var dummy = spawn('python', [__base + 'python/readPotentiometer.py']);

var currentSteeringAngle = 0, interval, currentValue, valueRange, angleRange, step;

module.exports = {
    initializeAndStart: function () {
        valueRange = config.steering.max.value - config.steering.min.value;
        angleRange = config.steering.max.angle + Math.abs(config.steering.min.angle);
        step = angleRange / valueRange;

        dummy.stdout.on('data', function (data) {
            this.setCurrentValue(data.toString());
            console.log(data.toString());
        });

        dummy.stdout.on('close', function (code) {
            console.log(code);
        });
        //this.startMonitoring()
    },

    startMonitoring: function () {
        var that = this;
        interval = setInterval(function () {
            var angle = step * that.getCurrentValue() + config.steering.min.angle;
            console.log(angle);
            that.setCurrentSteeringAngle(angle);
        }, 200);
    },

    stopMonitoring: function () {
        clearInterval(interval);
    },

    setCurrentValue: function (value) {
        currentValue = value;
    },

    getCurrentValue: function () {
        return currentValue;
    },

    onSteeringAngleChange: undefined,

    setCurrentSteeringAngle: function (angle) {
        // TODO comparison with defined number of decimals
        if (currentSteeringAngle !== angle) {
            currentSteeringAngle = angle;
            if (typeof this.onSteeringAngleChange === 'function') this.onSteeringAngleChange(currentSteeringAngle);
        }
    }
};