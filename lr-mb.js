'use strict';


// TODO: Create more functionality to reflect funcitonaility provided by mountebank API. (delete all imposters, get imposterm etc)
// TODO: Write some unit tests for this stuff
// TODO: Make an interactive program that allows for quick and easy manipulation of imposters including updating responses, headers, and predicates

// NOTE: Should objects be passed around as strings or as objects?

const fetch = require('node-fetch');
const _ = require('lodash');
const mb = require('mountebank');
const util = require('util');

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
    /* This is the JSON representation of our available routes. This will be formatted similarly to swagger. This is NOT the body of our Imposter POST requesti */
    this.RouteInformation = { };
    this.CompleteResponse = {
      'port' : port,
      'protocol': protocol,
      'stubs': []
    };
  }


  /**
  * [Takes in a route (URI + VERB) and a response body that is to be returned from MB when the given route gets reached]
  * @param  {Object} routeOptions     The options contianing information on the route + corresponding mocked respone
  * @param  {String} routeOptions.uri The URI of the route the user is wanting to match against
  * @param  {String} routeOptions.verb       The HTTP verb the is wanting to match against
  * @param  {Object} routeOptions.res The desired response that is to be returned when the above URI and method get matched
  * @param  {Number} routeOptions.res.statusCode The status code that will be returned
  * @param  {Object} routeOptions.res.headers The headers that will be returned
  * @param  {String} routeOptions.res.body A string representation of the body that will be returned
  * @returns {null} nothing gets returned
  */
  addRoute(routeOptions) {
    /* Input Validation */
    if (!_.isObject(routeOptions)) {
      throw new TypeError('routeOptions must be an object');
    }
    if (!_.isString(routeOptions.uri)) {
      throw new TypeError('routeOptions.uri must be a string');
    }
    if (!_.isString(routeOptions.verb)) {
      throw new TypeError('routeOptions.verb must be a string');
    }
    if (!_.isObject(routeOptions.res)) {
      throw new TypeError('routeOptions.res must be an object');
    }
    if (!_.isNumber(routeOptions.res.statusCode)) {
      throw new TypeError('routeOptions.res.statusCode must be a number');
    }
    if (!_.isString(routeOptions.res.responseBody)) {
      throw new TypeError('routeOptions.res.responseBody must be a string');
    }
    if (!_.isObject(routeOptions.res.responseHeaders)) {
      throw new TypeError('routeOptions.res.responseHeaders must be an object');
    }

    if ( (this.RouteInformation[routeOptions.uri]) != null) {
      this.RouteInformation[routeOptions.uri][routeOptions.verb] = routeOptions.res;
    }
    else {
      this.RouteInformation[routeOptions.uri] = {
        [routeOptions.verb] : routeOptions.res
      };
    }
  }

  printMe() {
    console.log(util.inspect(this.RouteInformation, { depth: null }));
  }
  printResponse() {
    console.log(util.inspect(this.CompleteResponse, { depth: null }));
  }


  createMBPostRequestBody() {
    for (const route in this.RouteInformation) {
      for (const verb in this.RouteInformation[route]) {
        let statusCode = this.RouteInformation[route][verb].statusCode;
        let responseHeaders = this.RouteInformation[route][verb].responseHeaders;
        let responseBody = this.RouteInformation[route][verb].responseBody;
        console.log('@@@ STATUS CODE: ' + statusCode);
        console.log('@@@ HEADER: ');
        console.log(responseHeaders);
        console.log('@@@ BODY: ' + responseBody);
        console.log('@@@ ROUTE: ' + route);
        console.log('@@@ VERB: ' + verb);

        let mbResponse = Imposter.createResponse(statusCode, responseHeaders, responseBody);
        let mbPredicate = Imposter.createPredicate('equals', {'method' : verb, 'path' : route } );

        console.log(mbResponse);
        console.log(mbPredicate);

        this.addNewStub(mbPredicate, mbResponse);
      }
    }
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
      throw new TypeError('body must be a string');
    }
    const finalResponse = {};
    const response = {};

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
  * @param  {Object} predicateBody       The body of the predicate. Often contains information on what conditions are to be met for a match on incoming request
  * @return {Object}            The mountebank-formatted prediate object that can be added as part of a mountebank stub
  */
  static createPredicate(operator, predicateBody) {
    if (!_.isString(operator)) {
      throw new TypeError('operator must be a string');
    }
    if (!_.isObject(predicateBody)) {
      throw new TypeError('predicateBody must be an object');
    }
    const predicate = {};
    predicate[operator] = predicateBody;
    return predicate;
  }

  /**
  * Adds a new stub containing arrays of predicates and responses to the skeleton for our imposter POST request body
  * @param {Object} predicate A predicate object constructed using the above createPredicate method
  * @param {Object} response   A response object constructed using the above createResponse method
  * @return {null}  nothing  Returns nothing
  */
  addNewStub(predicate, response) {
    this.CompleteResponse.stubs.push({
      predicates:[predicate],
      responses: [response]
    });
  }

  // TODO: Consolidate the next three functions into one function with additional parameter speicfying what the user wants to change
  // Somehthing like updateResponse(newParameter, stubIndex, responseIndex, parameterToBeChanged)
  // TODO: Possibly make an extra version of this method that isn't called on this, but instead is static and would take in another parameter port
  // that will uniquely identify the imposter that is to be updated
  updateResponseCode(newCode, stubIndex, responseIndex) {
    const previousResponseIndex = responseIndex || 0;
    const previousStubIndex = stubIndex || 0;

    // delete the old imposter
    const imposterDeleteRoute = `http://127.0.0.1:2525/imposters/${this.complete_response.port}`
    fetch(imposterDeleteRoute, { method: 'DELETE' });

    // update it
    this.complete_response.stubs[previousStubIndex].responses[previousResponseIndex].is.statusCode = newCode;

    // post it again
    fetch('http://127.0.0.1:2525/imposters', { imethod: 'POST', headers: { 'Content-Type' : 'application/json' }, body: JSON.stringify(this.complete_response)});
  }

  updateResponseHeaders(newHeaders, stubIndex, responseIndex) {
    const previousResponseIndex = responseIndex || 0;
    const previousStubIndex = stubIndex || 0;

    // delete the old imposter
    const imposterDeleteRoute = `http://127.0.0.1:2525/imposters/$ {this.complete_response.port }`
    fetch(imposterDeleteRoute, {method: 'DELETE'});

    // update it
    this.complete_response.stubs[previousStubIndex].responses[previousResponseIndex].is.headers = newHeaders;

    // post it again
    fetch('http://127.0.0.1:2525/imposters', {method: 'POST', headers: { 'Content-Type' : 'application/json' }, body: JSON.stringify(this.complete_response)});
  }


  /**
  * This will take the current imposter from the Mountebank server, delete it, update the (this) Imposter instance, and then post it again to the mb server
  * @return {Object}           Returns a promise (returns the node-fetch promise) that resolves the response and rejects with the error message
  */
  updateResponseBody(newBody, stubIndex, responseIndex) {
    var previousResponseIndex = responseIndex || 0;
    var previousStubIndex = stubIndex || 0;

    // delete the old imposter
    var imposterDeleteRoute = `http://127.0.0.1:2525/imposters/${this.complete_response.port}`
    fetch(imposterDeleteRoute, {method: 'DELETE'});

    // update it
    console.log(require('util').inspect(this, { depth: null }));;
    this.complete_response.stubs[previousStubIndex].responses[previousResponseIndex].is.body = newBody;

    // post it again
    return fetch('http://127.0.0.1:2525/imposters', {method: 'POST', headers: { 'Content-Type' : 'application/json' }, body: JSON.stringify(this.complete_response)});
  }

  printCurrentStubs(){
    console.log(JSON.stringify(this.complete_response, null, 3));
  }

  /**
  * This will take the current Imposter object (this) and make the POST request to the mountebank server to create the new imposter
  * @return {Object}           Returns a promise (returns the node-fetch promise) that resolves the response and rejects with the error message
  */
  postToMountebank() {
    const fetchReturnValue = fetch('http://127.0.0.1:2525/imposters', {method: 'POST', headers: { 'Content-Type' : 'application/json' }, body: JSON.stringify(this.complete_response)});
    return fetchReturnValue;
  }
}
// NOTE: This should obviously be a static method (not really tied to any one instance of an imposter) but should it be here in this class?

function start_mb_server() {
  var mbCreateResult = mb.create({
    port           : 2525,
    pidfile        : './mb.pid',
    logfile        : './mb.log',
    loglevel       : 'error',
    mock           : true,
    allowInjection : true,
  });
  return mbCreateResult;
}

module.exports.Imposter = Imposter;
