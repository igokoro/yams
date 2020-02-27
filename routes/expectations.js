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

const expectations = function (instructions) {
    return instructions.map(instruction => ({
        httpRequest: request(instruction),
        httpResponse: response(instruction.response)
    }))
}

module.exports.prepare = expectations;