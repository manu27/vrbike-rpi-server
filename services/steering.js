var os = require(__base + 'helpers/os');
if (os.isPlatform('linux')) {
    var sys = require('sys');
    var spawn = require('child_process').spawn;
    var poti = spawn('python', [__base + 'python/readPotentiometer.py'], ['0']);
}

var currentSteeringAngle = 0, interval, currentValue = 0, valueRange, angleRange, step, options;

module.exports = {
    initializeAndStart: function (settings) {
        options = settings;

        if (os.isPlatform('linux')) {
            valueRange = options.max.value - options.min.value;
            angleRange = options.max.angle + Math.abs(options.min.angle);
            step = angleRange / valueRange;

            var that = this;
            poti.stdout.on('data', function (data) {
                that.setCurrentValue(data.toString());
            });

            poti.stdout.on('close', function (code) {
                console.log(code);
            });
            this.startMonitoring()
        }
    },

    startMonitoring: function () {
        if (os.isPlatform('linux')) {
            var that = this;
            interval = setInterval(function () {
                var curValue = that.getCurrentValue();
                if (!curValue) return;
                var angle = step * curValue + options.min.angle;
                that.setCurrentSteeringAngle(Math.round(angle));
            }, 100);
        }
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