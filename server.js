'use strict'


const Imposter = require('./imposter')
const sample_html = require('./sample_html.js')

var firstImposter = new Imposter(3000, 'http');
var secondImposter = new Imposter(3001, 'http');



var firstResponse = {
  "statusCode" : 200,
  "body" : "<customer><email>customer@test.com</email></customer>",
  "headers" : {
    "location": "http://localhost:4545/customers/123",
    "content-type": "application/xml"
  }
};

var secondResponse = {
  "statusCode" : 200,
  "body" : sample_html,
  "headers" : {
    "content-type": "text/html"
  }
};


var firstPredicate = {
  operator: "equals",
  body: {
    "method" : "get",
    "path" : "/customers/123"
  }
}

var secondPredicate = {
  operator: "equals",
  body: {
    "method" : "get",
    "path" : "/newpage"
  }
}



/*firstImposter.updateResponseBody("<changed>muahahaha</changed>");
firstImposter.updateResponseCode(404);
*/

var responseOne = Imposter.createResponse(firstResponse.statusCode, firstResponse.headers, firstResponse.body);
var predicateOne = Imposter.createPredicate(firstPredicate.operator,firstPredicate.body);

var responseTwo = Imposter.createResponse(secondResponse.statusCode, secondResponse.headers, secondResponse.body);
var predicateTwo = Imposter.createPredicate(secondPredicate.operator,secondPredicate.body);

firstImposter.addNewStub(predicateOne, responseOne);
firstImposter.postToMountebank().then(function(response){
  console.log(response.status);
}).catch(function(error) {
  console.log(error);
});

secondImposter.addNewStub(predicateTwo, responseTwo);
secondImposter.postToMountebank().then(function(response){
  console.log(response.status);
}).catch(function(error) {
  console.log(error);
});
