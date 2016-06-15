'use strict';

const responseUtil = require('./util');
const lrMB = require('./lr-mb');
const myUtil = require('./util');


lrMB.startMbServer();
const firstImposter = new lrMB.Imposter(3000, 'http');
const secondImposter = new lrMB.Imposter(3001, 'http');
const helloResponseArray = responseUtil.returnResponsesForAllVerbs('/hello');
const petsResponseArray = responseUtil.returnResponsesForAllVerbs('/pets');
const thirdImposter = new lrMB.Imposter(3002, 'http');
const randomResponseArray = responseUtil.returnNumResponses(4);



console.time('Add All Routes, Make Post to MounteBank');



helloResponseArray.forEach(function (response) {
  console.log(response.verb + ' ' + response.uri);
  firstImposter.addRoute(response);
});


/*randomResponseArray.forEach(function (response) {
  console.log(response.verb + ' ' + response.uri);
  thirdImposter.addRoute(response);
});
*/
firstImposter.postToMountebank()
.then(function (response) {
  console.log(response.status);
  console.timeEnd('Add All Routes, Make Post to MounteBank');
})
.catch(function (error) {
  console.log(error);
});

firstImposter.updateResponseCode(500, { 'verb' : 'GET', 'uri' : '/hello' });
firstImposter.printRouteInformation();

// TODO: Make helper functoin that will randomly change a status code on a response every 5 seconds so that we can easily test the update functoins
