const expect = require('chai').expect;


const Imposter = require('../imposter')


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
