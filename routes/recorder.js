let express = require('express')
let yaml = require('js-yaml');
let fixtures = require('./fixture_writer')
let mockServerClient = require('mockserver-client').mockServerClient("localhost", 1080)

var router = express.Router()

router.post('/recording/fixures', function (req, res, next) {
    mockServerClient.retrieveRecordedExpectations({})
        .then(
            function (recordedExpectations) {
                console.log(JSON.stringify(recordedExpectations, null, 2));
                let preparedFixtures = fixtures.prepare(recordedExpectations)
                res.contentType('application/x-yaml')
                res.send(yaml.safeDump(preparedFixtures));
                mockServerClient.reset()
            },
            function (error) {
                console.log(error);
                res.send(error);
            }
        );
})

module.exports = router;