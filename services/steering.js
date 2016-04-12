var config = require(__base + 'config/default');
var sys = require('sys');
var spawn = require('child_process').spawn;
var poti = spawn('python', [__base + 'python/readPotentiometer.py'], ['0']);

var currentSteeringAngle = 0, interval, currentValue, valueRange, angleRange, step;

module.exports = {
    initializeAndStart: function () {
        valueRange = config.steering.max.value - config.steering.min.value;
        angleRange = config.steering.max.angle + Math.abs(config.steering.min.angle);
        step = angleRange / valueRange;

        var that = this;
        poti.stdout.on('data', function (data) {
            that.setCurrentValue(data.toString());
        });

        poti.stdout.on('close', function (code) {
            console.log(code);
        });
        this.startMonitoring()
    },

    startMonitoring: function () {
        var that = this;
        interval = setInterval(function () {
            var curValue = that.getCurrentValue();
            if (!curValue) return;
            var angle = step * curValue + config.steering.min.angle;
            that.setCurrentSteeringAngle(Math.round(angle));
        }, 100);
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