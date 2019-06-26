const https = require('https');
const http = require('http');
let promises = [];

exports.RegisterHTTPDependency = function(url, name, severity) {
  let promise = [];
  const pr = GeneratePromise(url);
  promise.push(pr, name, severity, HTTPCheck)
  promises.push(promise)
}

const createResult = ({ status, severity}) => ({
  status,
  severity,
  // setUserName (userName) {
  //   this.userName = userName;
  //   return this;
  // }
});

exports.Check = function() {
  let results = {};
  for (let i = 0; i < promises.length; i++) {
    const check = promises[i];
    const promise = check[0];
    const name = check[1];
    const severity = check[2];
    promise.then(function(value) {
      let status = HTTPCheck(value)
      let x = createResult({status, severity})
      results[name] = createResult({status, severity})
      console.log("result: ", results)
    });
  }
  
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

