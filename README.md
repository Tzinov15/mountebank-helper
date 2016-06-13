<h1> _MountebankHelper </h1>






<h5> Example </h5>

```
// import the library
const Imposter = require('./imposter')

// create skeleton for imposter by specifying port to listen on and protocol
var firstImposter = new Imposter(3002, 'http');


// construct the response you want to have returned from the imposter
var responseStatusCode = 200;
var responseBody = "<customer><email>customer@test.com</email></customer>";
var responseHeaders = {
  "location": "http://localhost:4545/customers/123",
  "content-type": "application/xml"
};
var Response = Imposter.createResponse(responseStatusCode, responseHeaders, responseBody)


// construct the predicate to specify conditions for imposter response
var predicateOperator = 'equals';
var predicateBody = {
  "method": "get",
  "path": "/customers/123"
};
var Predicate = Imposter.createPredicate(predicateOperator,predicateBody);

// add predicate and response to our imposter
firstImposter.addNewStub(Predicate, Response);


// build the complete body that will be sent to mountebank
firstImposter.createCompleteImposter();

// send request, creates imposter!
firstImposter.postToMountebank()



```
