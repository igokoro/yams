var express = require('express');
var router = express.Router();
var path = require('path')

yaml = require('js-yaml');
fs = require('fs');

var mockServerClient = require('mockserver-client').mockServerClient;

var storagePath = process.env.STORAGE;

const toArrayValues = (dict) => Object.fromEntries(Object.entries(dict).map(([k, v]) => [k, [v]]))

const request = function (requestInstructions) {
    return {
        method: requestInstructions.method,
        path: requestInstructions.path,
        queryStringParameters: requestInstructions.params == null ? null : toArrayValues(requestInstructions.params),
        headers: requestInstructions.headers == null ? {} : toArrayValues(requestInstructions.headers),
        body: requestInstructions.body
    }
}

const response = function (responseInstructions) {
    return {
        statusCode: responseInstructions.code,
        headers: responseInstructions.headers == null ? null : toArrayValues(responseInstructions.headers),
        cookies: responseInstructions.cookies,
        delay: {
            timeUnit: "SECONDS",
            value: responseInstructions.delay
        },
        body: responseInstructions.body
    }
}

const expectation = function (instructions) {
    return instructions.map(instruction => ({
        httpRequest: request(instruction),
        httpResponse: response(instruction.response)
    }))
}

router.get('/load/scenario/:scenarioId', function (req, res, next) {
    var scenarioId = req.params['scenarioId'];
    console.log(`loading scenario: ${req.params['scenarioId']}`)
    var scenario = yaml.safeLoad(fs.readFileSync(path.join(storagePath, `${scenarioId}.yaml`), 'utf8'));
    console.log(scenario);
    for (const capture of scenario) {
        console.log(`reading capture: ${capture}`)
        var mockPath = path.join(storagePath, `${capture}.yaml`)
        var mock = yaml.safeLoad(fs.readFileSync(mockPath, 'utf8'));

        console.log(mock)

        var server = mockServerClient("localhost", 1080);
        expectation(mock).forEach(instruction => server.mockAnyResponse(instruction))
    }
    res.send('loaded');
});

module.exports = router;