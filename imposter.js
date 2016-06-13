'use strict'

const util = require('util');
const fetch = require('node-fetch');
const _ = require('lodash');

class Imposter {
  /**
   * [Sets up the skelton for the POST request body that will be sent to the Mountebank server to set up the imposter]
   * @param  {Number} port     The port number that the imposter is to listen on for incoming requests
   * @param  {String} protocol The protocol that the imposter is to listen on. Options are http, https, tcp, and smtp
   * @return {Object }         Returns an instance of the Imposter class
   */
  constructor(port, protocol) {
    if (!_.isString(protocol)) {
      throw new TypeError('protocol must be a string');
    }
    if (!_.isNumber(port)) {
      throw new TypeError('port must be a number');
    }
    /* This is the skeleton on to which stubs (predicates + responses) will be added/updatd dynamically */
    this.complete_response = {
      "port": port,
      "protocol": protocol,
      "stubs": []
    };
  }

  /**
   * This will take in the users desired response components (status, headers, and body) and construct a mountebank-style response. Takes care of rigid formatting that MB requires
   * @param  {Number} statuscode The status code that the user wishes to have returned from the imposter
   * @param  {Object} headers    The headers to be returned as part of the imposters response
   * @param  {String} body       The body to be returned as part of the imposters response
   * @return {Object}            The mountebank-formatted response object that can be added as part of a mountebank stub
   */
  static createResponse(statuscode, headers, body) {
    if (!_.isNumber(statuscode)) {
      throw new TypeError('statuscode must be a number');
    }
    if (!_.isObject(headers)) {
      throw new TypeError('headers must be an object');
    }
    if (!_.isString(body)) {
      throw new TypeError('body must be an string');
    }
    var finalResponse = {};
    var response = {};

    response.statuscode = statuscode;
    response.headers = headers;
    response.body = body;
    /* A mountebank formatting thing where each response has a type (is, proxy, or inject) and this type must be specified in the form of a key where the value the actual response */
    finalResponse.is = response;
    return finalResponse;
  }

  /**
   * This will take in the users desired predicate components and construct a mounte-bank style predicate
   * @param  {String} operator   The operator to be used as part of this predicate (see mountebank predicate documentation for list of available operators)
   * @param  {Object} body       The body of the predicate. Often contains information on what conditions are to be met for a match on incoming request
   * @return {Object}            The mountebank-formatted prediate object that can be added as part of a mountebank stub
   */
  static createPredicate(operator, predicateBody) {
    if (!_.isString(operator)) {
      throw new TypeError('operator must be a string');
    }
    if (!_.isObject(predicateBody)) {
      throw new TypeError('operator must be a string');
    }
    var predicate = {};
    predicate[operator] = predicateBody;
    return predicate;
  }

  /**
   * Adds a new stub containing arrays of predicates and responses to the skeleton for our imposter POST request body
   * @param {Object} predicate A predicate object constructed using the above createPredicate method
   * @param {Object} response   A response object constructed using the above createResponse method
   */
  addNewStub(predicate, response)
  {
    this.complete_response.stubs.push({
      predicates:[predicate],
      responses: [response]
    });
  }

  // TODO: Consolidate the next three functions into one function with additional parameter speicfying what the user wants to change
  // Somehthing like updateResponse(newParameter, stubIndex, responseIndex, parameterToBeChanged)
  // TODO: Possibly make an extra version of this method that isn't called on this, but instead is static and would take in another parameter port
  // that will uniquely identify the imposter that is to be updated
  updateResponseCode(newCode, stubIndex, responseIndex) {
    var previousResponseIndex = responseIndex || 0;
    var previousStubIndex = stubIndex || 0;

    // delete the old imposter
    var imposterDeleteRoute = `http://127.0.0.1:2525/imposters/${this.complete_response.port}`
    fetch(imposterDeleteRoute, {method: 'DELETE'});

    // update it
    this.complete_response.stubs[previousStubIndex].responses[previousResponseIndex].is.statusCode = newCode;

    // post it again
    fetch('http://127.0.0.1:2525/imposters', {method: 'POST', headers: { "Content-Type" : "application/json" }, body: JSON.stringify(this.complete_response)});
  }

  updateResponseHeaders(newHeaders, stubIndex, responseIndex) {
    var previousResponseIndex = responseIndex || 0;
    var previousStubIndex = stubIndex || 0;

    // delete the old imposter
    var imposterDeleteRoute = `http://127.0.0.1:2525/imposters/${this.complete_response.port}`
    fetch(imposterDeleteRoute, {method: 'DELETE'});

    // update it
    this.complete_response.stubs[previousStubIndex].responses[previousResponseIndex].is.headers = newHeaders;

    // post it again
    fetch('http://127.0.0.1:2525/imposters', {method: 'POST', headers: { "Content-Type" : "application/json" }, body: JSON.stringify(this.complete_response)});
  }
  updateResponseBody(newBody, stubIndex, responseIndex) {
    var previousResponseIndex = responseIndex || 0;
    var previousStubIndex = stubIndex || 0;

    // delete the old imposter
    var imposterDeleteRoute = `http://127.0.0.1:2525/imposters/${this.complete_response.port}`
    fetch(imposterDeleteRoute, {method: 'DELETE'});

    // update it
    this.complete_response.stubs[previousStubIndex].responses[previousResponseIndex].is.body = newBody;

    // post it again
    fetch('http://127.0.0.1:2525/imposters', {method: 'POST', headers: { "Content-Type" : "application/json" }, body: JSON.stringify(this.complete_response)});
  }

  printCurrentStubs(){
    console.log(JSON.stringify(this.complete_response.stubs, null, 3));
  }

  postToMountebank ()
  {
    var fetchReturnValue = fetch('http://127.0.0.1:2525/imposters', {method: 'POST', headers: { "Content-Type" : "application/json" }, body: JSON.stringify(this.complete_response)});
    return fetchReturnValue;
  }

}

module.exports = Imposter;
