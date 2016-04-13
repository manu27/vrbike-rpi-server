var os = require('os');

module.exports = {
    isPlatform: function (platform) {
        return os.platform() === platform;
    }
};