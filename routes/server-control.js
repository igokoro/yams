var mockserver = require('mockserver-node');

module.exports.start = function() {
    mockserver.start_mockserver({
        serverPort: 1080,
        verbose: true
    });
}

module.exports.stop = function() {
    mockserver.stop_mockserver({
        serverPort: 1080
    });
}