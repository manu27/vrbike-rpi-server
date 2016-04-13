var os = require(__base + 'helpers/os');

if (os.isPlatform('linux')) {
    var wpi = require('wiring-pi');
}

var gpio28, options, timeout, currentRPM = 0;

module.exports = {

    initializeAndStart: function (settings) {
        options = settings;

        if (os.isPlatform('linux')) {
            wpi.setup('wpi');
            wpi.pinMode(28, wpi.INPUT);
            wpi.pullUpDnControl(28, wpi.PUD_DOWN);

            this.startMonitoring();
        }
    },

    startMonitoring: function () {
        if (os.isPlatform('linux')) {
            var that = this;
            wpi.wiringPiISR(28, wpi.INT_EDGE_RISING, function (delta) {
                if (timeout) clearTimeout(timeout);
                var newDelta = delta * options.numberOfMagnets;
                var rpm = 60000000 / newDelta;
                that.setCurrentRPM(rpm);
                timeout = setTimeout(function () {
                    that.setCurrentRPM(0);
                }, options.timeout);
            });
        }
    },

    stopMonitoring: function () {
        //gpio20.removeAllListeners('change');
    },

    onRPMChange: undefined,

    setCurrentRPM: function (rpm) {
        // TODO comparison with defined number of decimals
        if (currentRPM !== rpm) {
            currentRPM = rpm;
            if (typeof this.onRPMChange === 'function') {
                var rpmDelta = options.max.rpm - options.min.rpm;
                var valueDelta = options.max.value - options.min.value;
                var valuePerRPM = valueDelta / rpmDelta;
                var value = valuePerRPM * currentRPM;
                this.onRPMChange(Math.round(currentRPM), value);
            }
        }
    }

};