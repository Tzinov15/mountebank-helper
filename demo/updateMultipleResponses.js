'use strict';
const randomWords = require('random-words');
const myUtil = require('../util/util');
// import the mountebank helper library
const lrMB = require('../src/lr-mb');

// create the skeleton for the imposter (does not post to MB)
const firstImposter = new lrMB.Imposter(3000, 'http');


const helloResponses = myUtil.returnResponsesForAllVerbs('hello');

function updateManyResponses() {
  var prevPromise = Promise.resolve();

  for (var i = 0; i < 100; i++) {
    prevPromise = prevPromise.then(function () {
      const randomWordOne = randomWords();
      const randomWordTwo = randomWords();
      console.log(`randomWordOne: ${randomWordOne} randomWordTwo: ${randomWordTwo}`);
      return firstImposter.updateResponseBody(JSON.stringify({ [randomWordOne] : randomWordTwo }), { 'verb' : 'GET', 'uri' : '/hello' });
    }).then(function (data) {
      console.log(data.statusText);
    });
  }

  return prevPromise;
}

firstImposter.addRoute(helloResponses[0]);

firstImposter.postToMountebank().then(function () {
  console.log('start');
  console.time('updateManyResponses: ');
  updateManyResponses().then(function () {
    console.log('should be done with updateManyResponses');
    console.timeEnd('updateManyResponses: ');
    console.log('finish');
  });
});
