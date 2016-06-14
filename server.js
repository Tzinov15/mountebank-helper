'use strict'


const Imposter = require('./imposter')
const sample_html = require('./sample_html.js')

// NOTE: take in a single object containing port and protocol
// default to http
const firstImposter = new Imposter(3000, 'http');
const secondImposter = new Imposter(3001, 'http');




let imposter = new mountebank.Imposter({});
 let predicate1 = imposter.addPredicate({});
 predicate1.addResponse({});

 console.log(imposter.predicates);

let firstResponse = {
  "statusCode" : 200,
  "body" : "<customer><email>customer@test.com</email></customer>",
  "headers" : {
    "location": "http://localhost:4545/customers/123",
    "content-type": "application/xml"
  }
};

let secondResponse = {
  "statusCode" : 200,
  "body" : sample_html,
  "headers" : {
    "content-type": "text/html"
  }
};

let thirdResponse = {
  "statusCode" : 200,
  "body" : JSON.stringify({"hello" : "world"}),
  "headers" : {
    "content-type": "application/json"
  }
};

let firstPredicate = {
  operator: "equals",
  body: {
    "method" : "get",
    "path" : "/customers/123"
  }
}

let secondPredicate = {
  operator: "equals",
  body: {
    "method" : "get",
    "path" : "/newpage"
  }
}


/*let responseOne = Imposter.createResponse(firstResponse.statusCode, firstResponse.headers, firstResponse.body);
let predicateOne = Imposter.createPredicate(firstPredicate.operator,firstPredicate.body);
firstImposter.addNewStub(predicateOne, responseOne);
firstImposter.updateResponseBody("<changed>muahahaha</changed>");
firstImposter.updateResponseCode(404);
*/let responseOne = Imposter.createResponse(firstResponse.statusCode, firstResponse.headers, firstResponse.body);
let predicateOne = Imposter.createPredicate(firstPredicate.operator,firstPredicate.body);

let responseTwo = Imposter.createResponse(secondResponse.statusCode, secondResponse.headers, secondResponse.body);
let predicateTwo = Imposter.createPredicate(secondPredicate.operator,secondPredicate.body);
console.log(responseTwo);
firstImposter.printCurrentStubs();

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
