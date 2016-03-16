var currentSteeringAngle = 0;

module.exports = {
    onSteeringAngleChange: undefined,

    setCurrentSteeringAngle: function (angle) {
        // TODO comparison with defined number of decimals
        if (currentSteeringAngle !== angle) {
            currentSteeringAngle = angle;
            if (typeof this.onSteeringAngleChange === 'function') this.onSteeringAngleChange(currentSteeringAngle);
        }
    }
};