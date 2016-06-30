// TODO: Seperate this file (as it grows) into seperate test files based on their functionaility


const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chaiSubset = require('chai-subset');
chai.should();

chai.use(chaiAsPromised);
chai.use(chaiSubset);
const expect = chai.expect;


// import the mountebank helper library
const mbHelper = require('../src/index');
const Imposter = mbHelper.Imposter;

// TODO: Also check for object properties on final response body


describe('Input Validation', function () {
  describe('Imposter Constructor', function () {
    it('Should throw if options is not an object', function () {
      expect(function () {
        new Imposter('hello');
      }).to.throw('options must be a Object');
    });

    it('Should throw if options.imposterPort is not a number', function () {
      expect(function () {
        new Imposter({ 'imposterPort' : '201' });
      }).to.throw('options.imposterPort must be a Number');
    });

    it('Should default to setting protocol to http if one is not supplied', function () {
      expect( new Imposter({ 'mountebankPort' : 2525, 'imposterPort' : 3000 }).ImposterInformation.protocol).to.equal('http');
    });

    it('Should default to setting mountebankPort to 2525 if one is not supplied', function () {
      expect( new Imposter({ 'protocol' : 'http', 'imposterPort' : 3000 }).ImposterInformation.mountebankPort).to.equal(2525);
    });

    it('Should NOT throw if proper arguments are specified', function () {
      expect(function () {
        new Imposter({ 'mountebankPort' : 2525, 'imposterPort' : 3000 });
      }).to.not.throw();
    });
  });

  describe('Response Construction', function () {
    it('Should throw if statuscode is not a number', function () {
      expect(function () {
        Imposter._createResponse('hello', { 'Content-Type' : 'application/json' }, JSON.stringify({ 'hello' : 'world' }));
      }).to.throw('statuscode must be a number');
    });
    it('Should throw if headers is not an object', function () {
      expect(function () {
        Imposter._createResponse(200, JSON.stringify({ 'Content-Type' : 'application/json' }), JSON.stringify({ 'hello' : 'world' }));
      }).to.throw('headers must be an object');
    });
    it('Should throw if body is not a string', function () {
      expect(function () {
        Imposter._createResponse(200, { 'Content-Type' : 'application/json' }, { 'hello' : 'world' });
      }).to.throw('body must be a string');
    });
    it('Should NOT throw if proper arguments are specified', function () {
      expect(function () {
        Imposter._createResponse(200, { 'Content-Type' : 'application/json' }, JSON.stringify({ 'hello' : 'world' }));
      }).to.not.throw();
    });
  });

  describe('Predicate Construction', function () {
    it('Should throw if operator is not a string', function () {
      expect(function () {
        Imposter._createPredicate(200, { 'method' : 'get', 'path' : '/newpage' });
      }).to.throw('operator must be a string');
    });
    it('Should throw if predicateBody is not an object', function () {
      expect(function () {
        Imposter._createPredicate('expect', JSON.stringify({ 'method' : 'get', 'path' : '/newpage' }));
      }).to.throw('predicateBody must be an object');
    });
    it('Should NOT throw if proper arguments are specified', function () {
      expect(function () {
        Imposter._createPredicate('expect', { 'method' : 'get', 'path' : '/newpage' });
      }).to.not.throw();
    });
  });

  describe('addRoute', function () {
    const someImposter = new Imposter( { 'imposterPort' : 3000});
    it('Should throw if routeOptions is not an object', function () {
      expect(function () {
        someImposter.addRoute('This is a string');
      }).to.throw('routeOptions must be an object');
    });
    it('Should throw if routeOptions.uri is not a string', function () {
      expect(function () {
        someImposter.addRoute({ 'uri' : 200, 'verb' : 'GET', 'res' : { 'statusCode' : 201, 'responseBody' : 'hello', 'responseHeaders' : { 'Content-Type' : 'application/json' } } } );
      }).to.throw('routeOptions.uri must be a string');
    });
    it('Should throw if routeOptions.verb is not a string', function () {
      expect(function () {
        someImposter.addRoute({ 'uri' : '/hello', 'verb' : { 'get' : 'get' }, 'res' : { 'statusCode' : 201, 'responseBody' : 'hello', 'responseHeaders' : { 'Content-Type' : 'application/json' } } } );
      }).to.throw('routeOptions.verb must be a string');
    });
    it('Should throw if routeOptions.res is not an object', function () {
      expect(function () {
        someImposter.addRoute({ 'uri' : '/hello', 'verb' : 'get', 'res' : 'body' } );
      }).to.throw('routeOptions.res must be an object');
    });
    it('Should throw if routeOptions.res.statusCode is not a number', function () {
      expect(function () {
        someImposter.addRoute({ 'uri' : '/hello', 'verb' : 'get', 'res' : { 'statusCode' : '201', 'responseBody' : 'hello', 'responseHeaders' : { 'Content-Type' : 'application/json' } } } );
      }).to.throw('routeOptions.res.statusCode must be a number');
    });
    it('Should throw if routeOptions.res.responseBody is not a string', function () {
      expect(function () {
        someImposter.addRoute({ 'uri' : '/hello', 'verb' : 'get', 'res' : { 'statusCode' : 201, 'responseBody' : { 'hello' : 'world' }, 'responseHeaders' : { 'Content-Type' : 'application/json' } } } );
      }).to.throw('routeOptions.res.responseBody must be a string');
    });
    it('Should throw if routeOptions.res.responseHeaders is not an object', function () {
      expect(function () {
        someImposter.addRoute({ 'uri' : '/hello', 'verb' : 'get', 'res' : { 'statusCode' : 201, 'responseBody' : JSON.stringify({ 'hello' : 'world' }), 'responseHeaders' : JSON.stringify({ 'Content-Type' : 'application/json' }) } } );
      }).to.throw('routeOptions.res.responseHeaders must be an object');
    });
    it('Should NOT throw if proper arguments are specified', function () {
      expect(function () {
        someImposter.addRoute({ 'uri' : '/hello', 'verb' : 'get', 'res' : { 'statusCode' : 201, 'responseBody' : JSON.stringify({ 'hello' : 'world' }), 'responseHeaders' : { 'Content-Type' : 'application/json' } } } );
      }).to.not.throw();
    });
    it('Should properly normalize a passed in uri that does not have a leading slash', function () {
      someImposter.addRoute({ 'uri' : 'hello', 'verb' : 'get', 'res' : { 'statusCode' : 201, 'responseBody' : JSON.stringify({ 'hello' : 'world' }), 'responseHeaders' : { 'Content-Type' : 'application/json' } } } );
      someImposter.ImposterInformation.routeInformation.should.have.key('/hello');
    });
  });
  describe('_getResponse', function () {
    const anotherImposter = new Imposter( { 'imposterPort' : 3000 });
    it('Should throw if pathToUpdate is not an object', function () {
      expect(function () {
        anotherImposter._getResponse('hello');
      }).to.throw('pathToUpdate must be an object');
    });

    it('Should throw if pathToUpdate.uri is not a string', function () {
      expect(function () {
        anotherImposter._getResponse({ 'uri' : 200, 'verb' : 'get' });
      }).to.throw('pathToUpdate.uri must be a string');
    });

    it('Should throw if pathToUpdate.verb is not a string', function () {
      expect(function () {
        anotherImposter._getResponse({ 'uri' : '/hello', 'verb': 200 });
      }).to.throw('pathToUpdate.verb must be a string');
    });

    it('Should throw if the url being retrieved doesn\'t exist in the imposter', function () {
      expect(function () {
        anotherImposter._getResponse({ 'uri' : '/hello', 'verb': 'GET' });
      }).to.throw('ERROR (_getResponse) : Could not find a response for /hello');
    });

    it('Should throw if the verb being retrieved doesn\'t exist within the uri object for the imposter', function () {
      expect(function () {
        anotherImposter.addRoute({ 'uri' : '/hello', 'verb' : 'get', 'res' : { 'statusCode' : 201, 'responseBody' : JSON.stringify({ 'hello' : 'world' }), 'responseHeaders' : { 'Content-Type' : 'application/json' } } } );
        anotherImposter._getResponse({ 'uri' : '/hello', 'verb': 'post' });
      }).to.throw('ERROR (_getResponse) : Could not find a response for post/hello');
    });

  });
  describe('updateResponseHeaders', function () {
    const anotherImposter = new Imposter( { 'imposterPort' : 3000 });
    it('Should throw if pathToUpdate is not an object', function () {
      expect(function () {
        anotherImposter.updateResponseHeaders({ 'Content-Type' : 'application/json' }, 'hello');
      }).to.throw('pathToUpdate must be an object');
    });

    it('Should throw if pathToUpdate.uri is not a string', function () {
      expect(function () {
        anotherImposter.updateResponseHeaders({ 'Content-Type' : 'application/json' }, { 'uri' : 200, 'verb' : 'get' });
      }).to.throw('pathToUpdate.uri must be a string');
    });

    it('Should throw if pathToUpdate.verb is not a string', function () {
      expect(function () {
        anotherImposter.updateResponseHeaders({ 'Content-Type' : 'application/json' }, { 'uri' : '/hello', 'verb': 200 });
      }).to.throw('pathToUpdate.verb must be a string');
    });

    it('Should throw if newHeaders is not an object', function () {
      expect(function () {
        anotherImposter.updateResponseHeaders(JSON.stringify({ 'Content-Type' : 'application/json' }), { 'uri' : '/hello', 'verb': 'GET' });
      }).to.throw('newHeaders must be an object');
    });
  });

  describe('updateResponseBody', function () {
    const anotherImposter = new Imposter( { 'imposterPort' : 3000 });
    it('Should throw if pathToUpdate is not an object', function () {
      expect(function () {
        anotherImposter.updateResponseBody(205, 'hello');
      }).to.throw('pathToUpdate must be an object');
    });

    it('Should throw if pathToUpdate.uri is not a string', function () {
      expect(function () {
        anotherImposter.updateResponseBody(205, { 'uri' : 200, 'verb' : 'get' });
      }).to.throw('pathToUpdate.uri must be a string');
    });

    it('Should throw if pathToUpdate.verb is not a string', function () {
      expect(function () {
        anotherImposter.updateResponseBody(205, { 'uri' : '/hello', 'verb': 200 });
      }).to.throw('pathToUpdate.verb must be a string');
    });

    it('Should throw if newBody is not a string', function () {
      expect(function () {
        anotherImposter.updateResponseBody({ 'Content-Type' : 'application/json' }, { 'uri' : '/hello', 'verb': 'GET' });
      }).to.throw('newBody must be a string');
    });
  });

  describe('updateResponseCode', function () {
    const anotherImposter = new Imposter( { 'imposterPort' : 3000 });
    it('Should throw if pathToUpdate is not an object', function () {
      expect(function () {
        anotherImposter.updateResponseCode(205, 'hello');
      }).to.throw('pathToUpdate must be an object');
    });

    it('Should throw if pathToUpdate.uri is not a string', function () {
      expect(function () {
        anotherImposter.updateResponseCode(205, { 'uri' : 200, 'verb' : 'get' });
      }).to.throw('pathToUpdate.uri must be a string');
    });

    it('Should throw if pathToUpdate.verb is not a string', function () {
      expect(function () {
        anotherImposter.updateResponseCode(205, { 'uri' : '/hello', 'verb': 200 });
      }).to.throw('pathToUpdate.verb must be a string');
    });

    it('Should throw if newCode is not a number', function () {
      expect(function () {
        anotherImposter.updateResponseCode('205', { 'uri' : '/hello', 'verb': 'GET' });
      }).to.throw('newCode must be a number');
    });
  });

  describe('_updateResponse', function () {
    const anotherImposter = new Imposter( { 'imposterPort' : 3000 });
    it('Should throw if pathToUpdate is not an object', function () {
      expect(function () {
        anotherImposter._updateResponse(205, 'hello');
      }).to.throw('pathToUpdate must be an object');
    });

    it('Should throw if pathToUpdate.uri is not a string', function () {
      expect(function () {
        anotherImposter._updateResponse(205, 'attributeToUpdate', { 'uri' : 200, 'verb' : 'get' });
      }).to.throw('pathToUpdate.uri must be a string');
    });

    it('Should throw if pathToUpdate.verb is not a string', function () {
      expect(function () {
        anotherImposter._updateResponse(205, 'attributeToUpdate', { 'uri' : '/hello', 'verb': 200 });
      }).to.throw('pathToUpdate.verb must be a string');
    });

    it('Should throw if attributeToUpdate is not a string', function () {
      expect(function () {
        anotherImposter._updateResponse(JSON.stringify({ 'Content-Type' : 'application/json' }), 200, { 'uri' : '/hello', 'verb': 'GET' });
      }).to.throw('attributeToUpdate must be a string');
    });
  });
});
