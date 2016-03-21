var currentBrakePower = 0;

module.exports = {
    onBrakePowerChange: undefined,

    setCurrentBrakePower: function (power) {
        // TODO comparison with defined number of decimals
        if (currentBrakePower !== power) {
            currentBrakePower = power;
            if (typeof this.onBrakePowerChange === 'function') this.onBrakePowerChange(currentBrakePower);
        }
    }
};