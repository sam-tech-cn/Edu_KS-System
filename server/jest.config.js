module.exports = {
    testEnvironment: 'node',

    // @edu only collect coverage from specified files
    collectCoverageFrom: [
        "service/*.js"
        // @edu or not include "!service/notification-service.js"
    ]
}