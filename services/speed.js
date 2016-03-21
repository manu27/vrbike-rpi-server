var gpio = require('gpio');

/**
 * var options = {
 *  radius: 0.2,
 *  numberOfMagnets: 4,
 *  scale: 1
 * }
 */
var gpio25, frequency, options, timeout, currentAcceleration = 0;

module.exports = {

    initialize: function (settings) {
        options = settings;

        gpio25 = gpio.export(25, {
            direction: 'in',
            interval: 10,
            ready: function () {
                var time;
                console.log("GPIO25 ready to read!");

                gpio25.on('change', function (val) {
                    if (val) { // do something if signal is 1
                        if (timeout) {
                            clearTimeout(timeout);
                        }

                        if (time) {
                            var diff = process.hrtime(time);
                            frequency = (diff[0] * 1e9 + diff[1]) / 1e6;
                            console.log(frequency);
                        }
                        time = process.hrtime();
                        timeout = setTimeout(function () {
                            frequency = null;
                        }, 2000);
                    }
                });
            }
        });
    },

    /*getCurrentSpeed: function () {
        if (!frequency) {
            return 0;
        }

        var circumference = 2 * Math.PI * options.radius;
        var mToMDistance = circumference / options.numberOfMagnets; // Magnet-to-magnet distance
        var meterPerSecond = 1000 / frequency * mToMDistance * options.scale;

        return meterPerSecond * 3.6; // Output in km/h
    },*/

    onAccelerationChange: undefined,

    setCurrentAcceleration: function (acceleration) {
        // TODO comparison with defined number of decimals
        if (currentAcceleration !== acceleration) {
            currentAcceleration = acceleration;
            if (typeof this.onAccelerationChange === 'function') this.onAccelerationChange(currentAcceleration);
        }
    }

};