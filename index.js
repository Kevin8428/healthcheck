const https = require('https');
const http = require('http');
const { Pool, Client } = require('pg')
const TYPE_HTTP = 'http';
let tests = [];
let results = {}

exports.RegisterPostgresDependency = function(user, database, password, host, port, timeout) {
  var config = {
      user, 
      database,
      password,
      host,
      port, 
      max: 10, // max number of clients in the pool
      idleTimeoutMillis: timeout,
  };
  const pool = new Pool(config);
  pool.query('SELECT NOW()', (err, res) => {
    console.log(err, res)
    pool.end()
  })
}

exports.RegisterHTTPDependency = function(url, name, severity) {
  const start = Date.now()
  GeneratePromise(url).then(function(value) {
    let status = HTTPCheck(value);
    let duration = getDuration(start);
    tests.push(createResult({status, severity, name, TYPE_HTTP, duration }));
  }).catch(function(error) {
    let status = HTTPCheck(500);
    let duration = getDuration(start);
    tests.push(createResult({status, severity, name, TYPE_HTTP, duration }));
  });
}

const getDuration = function(start) {
  return Date.now() - start
}

const createResult = ({ status, severity, name, TYPE_HTTP, duration}) => ({
  status,
  severity,
  name,
  type: TYPE_HTTP,
  duration,
});

exports.Check = function() {
  let result = {};
  result.tests = {};
  let pass = true;
  for (let i = 0; i < tests.length; i++) {
    const test = tests[i];
    if (test.status != 'ok') {
      pass = false;
    }
    result.tests[test.name] = {
      "status": test.status,
      "type": test.type,
      "severity": test.severity,
      "duration": test.duration,
    }
  }
  result.status = pass ? 'ok' : 'fail';
  result.timestamp = Date.now();
  console.log('result: ', result)
  return result
}

let HTTPCheck = function(code){
  console.log('code: ', code)
  if (code > 399) {
    return 'fail'
  } else {
    return 'ok'
  }
}

let GeneratePromise = function(url){
  if (url.includes("http://")) {
    return new Promise(function(resolve, reject) {
      // resolve(20)
      http.get(url, (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
          data += chunk;
        });
        resp.on('end', () => {
          resolve(resp.statusCode);
        });
      }).on("error", (err) => {
        reject(err);
      });
    });
  } else if (url.includes("https://")) {
    return new Promise(function(resolve, reject) {
      // resolve(30)
      https.get(url, (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
          data += chunk;
        });
        resp.on('end', () => {
          resolve(resp.statusCode);
        });
      }).on("error", (err) => {
        reject(err);
      });
    });
  }
}

// exports.SamplePromise = new Promise(function(resolve, reject) {
//   https.get('https://www.google.com/', (resp) => {
//     let data = '';
//     resp.on('data', (chunk) => {
//       data += chunk;
//     });
//     resp.on('end', () => {
//       console.log('status code: ', resp.statusCode)
//       resolve(resp.statusCode);
//     });
//   }).on("error", (err) => {
//     reject(err);
//   });
// });

