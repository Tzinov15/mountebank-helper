'use strict'

const util = require('util');
const fetch = require('node-fetch');

class Imposter {
  constructor(port, protocol) {
    //console.log('Hello from the imposter constructor');
    this._port = port;
    this._protocol = protocol;
    this.stubs = [];
    this.complete_response = {
      "port": port,
      "protocol": protocol,
      "stubs": []
    };
  }
  createResponse(statuscode, headers, body) {
    var finalResponse = {};
    var response = {};

    response.statuscode = statuscode;
    response.headers = headers;
    response.body = body;
    finalResponse.is = response;
    //console.log(finalResponse);
    return finalResponse;
  }
  createPredicate(operator, predicatebody) {
    var predicate = {};
    predicate[operator] = predicatebody;
    //console.log(predicate);
    return predicate;
  }

  addNewStub(predicates, responses)
  {
    this.stubs.push({
      predicates:[predicates],
      responses: [responses]
    });
  }

  createCompleteImposter() {
    this.complete_response.stubs = this.stubs;
    this.complete_response = JSON.stringify(this.complete_response);
  }


  printMe() {
    console.log(this.complete_response);
  }


 postImposter ()
 {
   var fetchReturnValue = fetch('http://127.0.0.1:2525/imposters', {method: 'POST', headers: { "Content-Type" : "application/json" }, body: this.complete_response});
   return fetchReturnValue;
 }

}

module.exports = Imposter;
