'use strict'


const Imposter = require('./imposter')

var firstImposter = new Imposter(3000, 'http');

var responseBody = "<customer><email>customer@test.com</email></customer>";
var responseHeaders = {
  "location": "http://localhost:4545/customers/123",
  "content-type": "application/xml"
}

var operator = 'equals';
var pred_body = {
  "method": "get",
  "path": "/customers/123"
};

var builtResponse = firstImposter.createResponse(200, responseHeaders, responseBody)
var builtPredicate = firstImposter.createPredicate(operator,pred_body);

firstImposter.addNewStub(builtPredicate, builtResponse);
firstImposter.createCompleteImposter();
firstImposter.printMe();
firstImposter.postImposter();
