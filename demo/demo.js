'use strict';
console.log('start');

// import the mountebank helper library
const lrMB = require('./src/lr-mb');

// create the skeleton for the imposter (does not post to MB)
const firstImposter = new lrMB.Imposter(3000, 'http');

// construct sample responses and conditions on which to send it
const sample_response = {
  'uri' : '/hello',
  'verb' : 'GET',
  'res' : {
    'statusCode': 200,
    'responseHeaders' : { 'Content-Type' : 'application/json' },
    'responseBody' : JSON.stringify({ 'hello' : 'world' })
  }
};

const another_response = {
  'uri' : '/pets/123',
  'verb' : 'PUT',
  'res' : {
    'statusCode': 200,
    'responseHeaders' : { 'Content-Type' : 'application/json' },
    'responseBody' : JSON.stringify({ 'somePetAttribute' : 'somePetValue' })
  }
};


// add our responses to our imposter
firstImposter.addRoute(sample_response);
firstImposter.addRoute(another_response);

// start the MB server (defaults to port 2525) and then
lrMB.startMbServer()
.then(function () {
  return firstImposter.postToMountebank();
})
.then(function () {
  return firstImposter.updateResponseBody(JSON.stringify({ 'goodbye' : 'friends' }), { 'verb' : 'GET', 'uri' : '/hello' });
})
.catch(function (error) {
  console.log('error: ');
  console.log(error);
});


// DONE:40 Make helper functoin that will randomly change a status code on a response every 5 seconds so that we can easily test the update functoins
