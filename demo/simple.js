'use strict';

// import the mountebank helper library
const mb_helper = require('../src/mb_helper');

// create the skeleton for the imposter (does not post to MB)
const firstImposter = new mb_helper.Imposter({ 'imposterPort' : 3000 });

// construct sample responses and conditions on which to send it
const sampleResponse = {
  'uri' : '/hello',
  'verb' : 'GET',
  'res' : {
    'statusCode': 200,
    'responseHeaders' : { 'Content-Type' : 'application/json' },
    'responseBody' : JSON.stringify({ 'hello' : 'world' })
  }
};

const anotherResponse = {
  'uri' : '/pets/123',
  'verb' : 'PUT',
  'res' : {
    'statusCode': 200,
    'responseHeaders' : { 'Content-Type' : 'application/json' },
    'responseBody' : JSON.stringify({ 'somePetAttribute' : 'somePetValue' })
  }
};


// add our responses to our imposter
firstImposter.addRoute(sampleResponse);
firstImposter.addRoute(anotherResponse);

firstImposter.postToMountebank()
.then(response => {
  console.log('response: ');
  console.log(response);
})
.catch(error => {
  console.log('error: ');
  console.log(error);
})
.then( () => {
  firstImposter.updateResponseBody(JSON.stringify({ 'WHAT' : 'UP' }), { 'verb' : 'GET', 'uri' : '/hello' });
})
.catch(error => {
  console.log('second error: ');
  console.log(error);
});
