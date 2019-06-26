const https = require('https');
const http = require('http');
let promises = [];

exports.RegisterHTTPDependency = async function(url, name, severity) {
  let promise = [];
  let pr = await GeneratePromise(url);
  promise.push(pr, name, severity, HTTPCheck)
  promises.push(promise)
  console.log('promises1: ', promises)
}


const createResult = ({ status, severity}) => ({
  status,
  severity,
});

exports.Check = function() {
  console.log('promises2: ', promises)
  let results = {};
  for (let i = 0; i < promises.length; i++) {
    const check = promises[i];
    const promise = check[0];
    const name = check[1];
    const severity = check[2];
    console.log('promise: ', promise)
    // promise.then(function(value) {
    //   let status = HTTPCheck(value)
    //   results[name] = createResult({status, severity})
    //   console.log('results: ', results)
    // });
  }
}

let HTTPCheck = function(code){
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

