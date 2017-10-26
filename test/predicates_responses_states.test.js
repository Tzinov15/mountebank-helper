const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chaiSubset = require('chai-subset');
const myUtil = require('../util/util');
chai.should();

chai.use(chaiAsPromised);
chai.use(chaiSubset);
const expect = chai.expect;


// import the mountebank helper library
const mbHelper = require('../src/index');
const Imposter = mbHelper.Imposter;

const testStubs = require('./testStubs');

function pretty(obj) {
  return JSON.stringify(obj, null, 2)
}

describe('Construction of Predicates, Responses, Stubs', function () {

  it('Construction of Predicate should return properly formatted predicate', function () {
    expect(JSON.stringify(Imposter._createPredicate('equals', {
      'method': 'get',
      'path': '/newpage'
    }))).to.equal(JSON.stringify(testStubs.samplePredicate));
  });

  it('Construction of Response should return properly formatted response', function () {
    expect(JSON.stringify(Imposter._createResponse(200, {
      'Content-Type': 'application/json'
    }, JSON.stringify({
      'hello': 'world'
    })))).to.equal(JSON.stringify(testStubs.sampleReponse));
  });
});

describe('Route Information and MB Post Request Body', function () {
  const someImposter = new Imposter({
    'imposterPort': 3000
  });
  const bunchOfResponses = myUtil.returnResponsesForAllVerbs('/areas');
  it('Imposter state should contain correct information after several addRoute calls', function () {
    bunchOfResponses.forEach((element, index, array) => {
      someImposter.addRoute(element);
    });
    const GET = {
      name: 'GET',
      response: {
        statusCode: 200,
        responseHeaders: {
          'Content-Type': 'application/json'
        },
        responseBody: '{"/areas":"GET"}'
      },
      predicates: []
    };
    const POST = {
      name: 'POST',
      response: {
        statusCode: 200,
        responseHeaders: {
          'Content-Type': 'application/json'
        },
        responseBody: '{"/areas":"POST"}'
      },
      predicates: []
    }

    const PUT = {
      name: 'PUT',
      response: {
        statusCode: 200,
        responseHeaders: {
          'Content-Type': 'application/json'
        },
        responseBody: '{"/areas":"PUT"}'
      },
      predicates: []
    }
    const DELETE = {
      name: 'DELETE',
      response: {
        statusCode: 200,
        responseHeaders: {
          'Content-Type': 'application/json'
        },
        responseBody: '{"/areas":"DELETE"}'
      },
      predicates: []
    }

    const response = someImposter.getStateResponse()
    const areas = response['/areas']
    areas.GET.should.deep.equal(GET)
    areas.POST.should.deep.equal(POST)
    areas.PUT.should.deep.equal(PUT)
    areas.DELETE.should.deep.equal(DELETE)

    // response.should.deep.equal({
    //   '/areas': {
    //     GET,
    //     POST,
    //     PUT,
    //     DELETE
    //   }
    // });
  });

  it('Mountebank Response Body should be correctly formatted after several addRoute calls', function () {
    const response = someImposter.getMountebankResponse()
    const stubs = response.stubs
    const stub = stubs[0]

    const expectedStubs = [{
        predicates: [{
          matches: {
            method: 'GET',
            path: '/areas'
          }
        }],
        responses: [{
          is: {
            statusCode: 200,
            headers: {
              'Content-Type': 'application/json'
            },
            body: '{"/areas":"GET"}'
          }
        }]
      },
      {
        predicates: [{
          matches: {
            method: 'POST',
            path: '/areas'
          }
        }],
        responses: [{
          is: {
            statusCode: 200,
            headers: {
              'Content-Type': 'application/json'
            },
            body: '{"/areas":"POST"}'
          }
        }]
      },
      {
        predicates: [{
          matches: {
            method: 'PUT',
            path: '/areas'
          }
        }],
        responses: [{
          is: {
            statusCode: 200,
            headers: {
              'Content-Type': 'application/json'
            },
            body: '{"/areas":"PUT"}'
          }
        }]
      },
      {
        predicates: [{
          matches: {
            method: 'DELETE',
            path: '/areas'
          }
        }],
        responses: [{
          is: {
            statusCode: 200,
            headers: {
              'Content-Type': 'application/json'
            },
            body: '{"/areas":"DELETE"}'
          }
        }]
      }
    ]

    response.should.deep.equal({
      port: 3000,
      protocol: 'http',
      stubs: expectedStubs
    });
  });
});
