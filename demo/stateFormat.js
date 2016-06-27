'use strict';

// import the mountebank helper library
const mb_helper = require('../src/index');

// create the skeleton for the imposter (does not post to MB)
const firstImposter = new mb_helper.Imposter({ 'imposterPort' : 300 });

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


const originalStateResponse = firstImposter.getStateReponse();
console.log('~~ SWAGGER-LIKE STATE ~~ ');
console.log('~~~~~~~~~~~~~~~~~~~~~~');
console.log(originalStateResponse);

const firstRoute = originalStateResponse['\/hello'];
console.log('');
console.log('firstRoute: (from state object) ');
console.log('~~~~~~~~~~~~~~~~~~~~~~');
console.log(firstRoute);

const mountebankResponse = firstImposter.getMountebankResponse();
console.log('');
console.log('');
console.log('~~ MOUNTEBANK RESPONSE ~~ ');
console.log('~~~~~~~~~~~~~~~~~~~~~~');
console.log(mountebankResponse);

const firstStub = mountebankResponse.stubs[0];
console.log('');
console.log('firstStub: (from MB body) ');
console.log('~~~~~~~~~~~~~~~~~~~~~~');
console.log(firstStub);

const firstPredicate = firstStub.predicates[0];
console.log('');
console.log('firstPredicate: (from MB body) ');
console.log('~~~~~~~~~~~~~~~~~~~~~~');
console.log(firstPredicate);

const firstResponse = firstStub.responses[0];
console.log('');
console.log('firstResponse: (from MB body) ');
console.log('~~~~~~~~~~~~~~~~~~~~~~');
console.log(firstResponse);
