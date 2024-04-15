const path = require('path');

module.exports = {
    testEnvironment: 'node',
    clearMocks: true,
    globalSetup: path.resolve('jest-mongodb-setup.js'),
    globalTeardown: path.resolve('jest-mongodb-teardown.js'),  
};