var assert = require('assert');
var index = require('../index');
describe('Basic Mocha String Test', function () {
  // it('promise', function () {
  //   index.SamplePromise.then(function(value) {
  //     console.log("promise value: ", value);
  //     assert.equal(value, 200);
  //   });
  // });
  // it('register one', function () {
  //   const code = index.RegisterHTTPDependency("https://www.google.com/", "test-1-google","critical")
  //   code.then(function(value) {
  //     console.log("promise two value: ", value);
  //     assert.equal(value, 200);
  //   });
  // });
  it('register multiple', function () {
    index.RegisterHTTPDependency("https://www.google.com/", "test-1-google","critical")
    index.RegisterHTTPDependency("https://www.github.com/", "test-2-github","critical")
    index.Check()
  });
});