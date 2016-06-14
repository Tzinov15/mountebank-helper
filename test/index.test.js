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
        new Imposter('hello', 'world');
      }).to.throw('port must be a number');
    });
  });
});
