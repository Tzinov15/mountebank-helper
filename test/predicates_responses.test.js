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

const testStubs = require('./testStubs');


describe('Construction of Predicates, Responses, Stubs', function () {

  it('Construction of Predicate should return properly formatted predicate', function () {
    expect(JSON.stringify(Imposter._createPredicate('equals', { 'method' : 'get', 'path' : '/newpage' }))).to.equal(JSON.stringify(testStubs.samplePredicate));
  });

  it('Construction of Response should return properly formatted response', function () {
    expect(JSON.stringify(Imposter._createResponse(200, { 'Content-Type' : 'application/json' }, JSON.stringify({ 'hello' : 'world' })))).to.equal(JSON.stringify(testStubs.sampleReponse));
  });

});
