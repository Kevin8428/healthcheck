var assert = require('assert');
var index = require('../index');
describe('Basic Mocha String Test', function () {
  it('register multiple', function () {
    index.RegisterHTTPDependency("http://www.google.com/", "test-1-google","critical")
    index.RegisterHTTPDependency("http://www.github.com/", "test-2-github","critical")
    setTimeout(index.Check, 3000);
  });
});