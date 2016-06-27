'use strict';
const randomWords = require('random-words');
const myUtil = require('../util/util');
const mbHelper = require('../src/index');

const helloResponses = myUtil.returnResponsesForAllVerbs('hello');

// create the imposter
const firstImposter = new mbHelper.Imposter({ 'imposterPort' : 3000 });

function updateManyResponses() {
  let prevPromise = Promise.resolve();

  for (let i = 0; i < 6; i++) { // for each update we wish to perform...
    prevPromise = prevPromise.then(function () { // set the promise equal to the result of our async method. Enforce sequential order
      const randomWordOne = randomWords(); // generate two random words
      const randomWordTwo = randomWords();
      console.log(`randomWordOne: ${randomWordOne} randomWordTwo: ${randomWordTwo}`);
      // update the response body of our existing response and return the resolved promise
      return firstImposter.updateResponseBody(JSON.stringify({ [randomWordOne] : randomWordTwo }), { 'verb' : 'GET', 'uri' : '/hello' });
    }).then(function () {
      console.log('success');
    })
    .catch(error => {
      console.log('error: ');
      console.log(error);
    });

  }
  // return the promise so that we can perform actions after the for loop has finished executing
  return prevPromise;
}

// add a single route
firstImposter.addRoute(helloResponses[0]);

// once we post to Mountebank, start the timer, and start updating the one response in sequential order

mbHelper.startMbServer(2525)
.then( () => {
  firstImposter.postToMountebank().then(function () {
    console.log('start');
    console.time('updateManyResponses: ');
    updateManyResponses().then(function () { // once we are done updating 100 times, stop the timer
      console.log('should be done with updateManyResponses');
      console.timeEnd('updateManyResponses: ');
      console.log('finish');
    })
    .catch(error => {
      console.log('error: ');
      console.log(error);
    });
  })
  .catch(error => {
    console.log('error: ');
    console.log(error);
  });

});
