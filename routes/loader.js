let express = require('express');
let path = require('path')
let yaml = require('js-yaml');
let fs = require('fs');
let expectations = require('./expectations')
let mockServerClient = require('mockserver-client').mockServerClient("localhost", 1080);

let storagePath = process.env.STORAGE;

var router = express.Router();
router.get('/load/scenario/:scenarioId', function (req, res, next) {
    var scenarioId = req.params['scenarioId'];
    console.log(`loading scenario: ${scenarioId}`)
    var scenario = yaml.safeLoad(fs.readFileSync(path.join(storagePath, `${scenarioId}.yaml`), 'utf8'));
    console.log(scenario);
    for (const capture of scenario) {
        console.log(`reading capture: ${capture}`)
        var mockPath = path.join(storagePath, `${capture}.yaml`)
        var mock = yaml.safeLoad(fs.readFileSync(mockPath, 'utf8'));

        console.log(mock)
        expectations.prepare(mock).forEach(instruction => mockServerClient.mockAnyResponse(instruction))
    }
    res.send('loaded');
});

module.exports = router;