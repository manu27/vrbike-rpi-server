var PythonShell = require('python-shell');
var readPoti = new PythonShell(__base + 'python/readPotentiometer.py', { args: [0] });
var config = require(__base + 'config/default');

var currentSteeringAngle = 0, interval, currentValue, valueRange, angleRange, step;

module.exports = {
    initializeAndStart: function () {
        valueRange = config.steering.max.value - config.steering.min.value;
        angleRange = config.steering.max.angle - Math.abs(config.steering.min.angle);
        step = angleRange / valueRange;

        readPoti.on('message', function (message) {
            currentValue = message;
        });
        this.startMonitoring()
    },

    startMonitoring: function () {
        var that = this;
        interval = setInterval(function () {
            var angle = step * currentValue + config.steering.min.angle;
            console.log(angle);
            that.setCurrentSteeringAngle(angle);
        }, 100);
    },

    stopMonitoring: function () {
        clearInterval(interval);
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