
const toSingleValues = (dict) => Object.fromEntries(Object.entries(dict || {}).map(([k, v]) => [k, v[0]]))

const writeResponse = function(responseRecord) {
    return {
        code: responseRecord.statusCode,
        headers: toSingleValues(responseRecord.headers),
        cookies: responseRecord.cookies || {},
        body: JSON.parse(responseRecord.body)
    }
}

const fixure = function(record) {
    let request = record.httpRequest
    let response = record.httpResponse
    return {
        path: request.path,
        method: request.method,
        params: toSingleValues(request.queryStringParameters),
        headers: toSingleValues(request.headers),
        cookies: request.cookies || {},
        body: JSON.parse(request.body.json),
        response: writeResponse(response)
    }
}

const fixures = function(recordedExpectations) {
    return recordedExpectations.map(record => fixure(record))
}

module.exports.prepare = fixures;