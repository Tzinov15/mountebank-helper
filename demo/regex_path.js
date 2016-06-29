'use strict';
console.log('REGEX');

// import the mountebank helper library
const mb_helper = require('../src/index');

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

const working_word_regex = '/pets/\\w+/\\w+';
const working_number_regex = '/pets/\\d';
const anotherResponse = {
  'uri' : working_word_regex,
  'verb' : 'GET',
  'res' : {
    'statusCode': 200,
    'responseHeaders' : { 'Content-Type' : 'application/json' },
    'responseBody' : JSON.stringify({ 'somePetAttribute' : 'somePetValue' })
  }
};


// add our responses to our imposter
firstImposter.addRoute(anotherResponse);
const originalStateResponse = firstImposter.getStateReponse();

mb_helper.startMbServer(2525)
.then( () => {
  firstImposter.postToMountebank()
  .then(response => {
    console.log('response.status: ');
    console.log(response.status);
  })
  .catch(error => {
    console.log('error: ');
    console.log(error);
  });
});
