const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const expect = chai.expect;


const Imposter = require('../imposter');
const testStubs = require('./testStubs');


// TODO: Also check for object properties on final response body


describe ('Input Validation', function(){

  describe('Imposter Constructor', function() {

    it('Should throw if port is not a number', function(){
      expect(function() {
        new Imposter('hello', 'world');
      }).to.throw('port must be a number');
    });

    it('Should throw if protocol is not a string', function(){
      expect(function() {
        new Imposter('hello', 15);
      }).to.throw('protocol must be a string');
    });

    it('Should NOT throw if proper arguments are specified', function(){
      expect(function() {
        new Imposter(3000, 'http');
      }).to.not.throw();
    });
  });

  describe('Response Construction', function () {

    it('Should throw if statuscode is not a number', function(){
      expect(function() {
          Imposter.createResponse('hello', {"Content-Type" : "application/json"}, JSON.stringify({"hello" : "world"}));
      }).to.throw('statuscode must be a number');
    });

    it('Should throw if headers is not an object', function(){
      expect(function() {
          Imposter.createResponse(200, JSON.stringify({"Content-Type" : "application/json"}), JSON.stringify({"hello" : "world"}));
      }).to.throw('headers must be an object');
    });

    it('Should throw if body is not a string', function(){
      expect(function() {
          Imposter.createResponse(200, {"Content-Type" : "application/json"}, {"hello" : "world"});
      }).to.throw('body must be a string');
    });

    it('Should NOT throw if proper arguments are specified', function(){
      expect(function() {
          Imposter.createResponse(200, {"Content-Type" : "application/json"}, JSON.stringify({"hello" : "world"}));
      }).to.not.throw();
    });
  })

  describe('Predicate Construction', function () {

    it('Should throw if operator is not a string', function(){
      expect(function() {
          Imposter.createPredicate(200, { "method" : "get", "path" : "/newpage" });
      }).to.throw('operator must be a string');
    });

    it('Should throw if predicateBody is not an object', function(){
      expect(function() {
          Imposter.createPredicate("expect", JSON.stringify({ "method" : "get", "path" : "/newpage" }));
      }).to.throw('predicateBody must be an object');
    });

    it('Should NOT throw if proper arguments are specified', function(){
      expect(function() {
          Imposter.createPredicate("expect", { "method" : "get", "path" : "/newpage" });
      }).to.not.throw();
    });
  })
});


describe('Construction of Predicates, Responses, Stubs', function() {

  it('Construction of Predicate should return properly formatted predicate', function() {
    expect(JSON.stringify(Imposter.createPredicate("equals", { "method" : "get", "path" : "/newpage" }))).to.equal(JSON.stringify(testStubs.samplePredicate));
  });

  it('Construction of Response should return properly formatted response', function() {
    expect(JSON.stringify(Imposter.createResponse(200, {"Content-Type" : "application/json"}, JSON.stringify({"hello" : "world"})))).to.equal(JSON.stringify(testStubs.sampleReponse));
  });

});


describe('postToMountebank should properly handle fetch HTTP call', function() {
  var testImposter;
  before(function startUpMounteBank(){
    Imposter.start_mb_server();
  });
  before(function constructImposter(){
    testImposter = new Imposter(3000,'http');
    const testPredicate = Imposter.createPredicate("expect", { "method" : "get", "path" : "/newpage" });
    const testResponse = Imposter.createResponse(200, {"Content-Type" : "application/json"}, JSON.stringify({"hello" : "world"}));
    testImposter.addNewStub(testPredicate, testResponse);

  })
  it('should return a promise', function() {
    testImposter.postToMountebank().to.eventually.equal(400);
  })
})
