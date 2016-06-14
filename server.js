'use strict';

const responseUtil = require('./util');
const lrMB = require('./lr-mb');

const firstImposter = new lrMB.Imposter(3000, 'http');
const helloResponseArray = responseUtil.returnResponsesForAllVerbs('/hello');
const petsResponseArray = responseUtil.returnResponsesForAllVerbs('/pets');


helloResponseArray.forEach(function (response) {
  firstImposter.addRoute(response);
});

/*petsResponseArray.forEach(function (response) {
  firstImposter.addRoute(response);
});
*/

firstImposter.createMBPostRequestBody();
firstImposter.postToMountebank();
