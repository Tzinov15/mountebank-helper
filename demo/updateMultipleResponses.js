'use strict';
const randomWords = require('random-words');
const myUtil = require('../util/util');
const lrMB = require('../src/lr-mb');

const helloResponses = myUtil.returnResponsesForAllVerbs('hello');

// create the imposter
const firstImposter = new lrMB.Imposter(3000, 'http');

function updateManyResponses() {
  var prevPromise = Promise.resolve();

  for (var i = 0; i < 2; i++) { // for each update we wish to perform...
    prevPromise = prevPromise.then(function () { // set the promise equal to the result of our async method. Enforce sequential order
      const randomWordOne = randomWords(); // generate two random words
      const randomWordTwo = randomWords();
      console.log(`randomWordOne: ${randomWordOne} randomWordTwo: ${randomWordTwo}`);
      // update the response body of our existing response and return the resolved promise
      return firstImposter.updateResponseBody(JSON.stringify({ [randomWordOne] : randomWordTwo }), { 'verb' : 'GET', 'uri' : '/hello' });
    }).then(function (data) {
      console.log(data);
    });
  }
  // return the promise so that we can perform actions after the for loop has finished executing
  return prevPromise;
}

// add a single route
firstImposter.addRoute(helloResponses[0]);

// once we post to Mountebank, start the timer, and start updating the one response in sequential order
firstImposter.postToMountebank().then(function () {
  console.log('start');
  console.time('updateManyResponses: ');
  updateManyResponses().then(function () { // once we are done updating 100 times, stop the timer
    console.log('should be done with updateManyResponses');
    console.timeEnd('updateManyResponses: ');
    console.log('finish');
  });
});
