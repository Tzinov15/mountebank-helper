const randomWords = require('random-words');
const staticJSON = require('./config/randomJSON').staticJSON;



function returnResponsesForAllVerbs(uri) {

  const verbArray = ['GET', 'POST', 'PUT', 'DELETE'];
  const responseArray = [];


  verbArray.forEach(function (verb) {
    responseArray.push(
      {
        'uri' : uri,
        'verb' : verb,
        'res' : {
          'statusCode': 200,
          'responseHeaders' : { 'Content-Type' : 'application/json' },
          'responseBody' : JSON.stringify({ [uri] : verb })
        }
      });
  });


  return responseArray;
}


function returnNumResponses(num) {
  const responseArray = [];
  const verbArray = ['GET', 'POST', 'PUT', 'DELETE'];
  for (var i = 0; i < num; i++) {

    var randomVerb = verbArray[Math.floor(Math.random() * verbArray.length ) ];
    var randomURI = `/${randomWords()}`;
    responseArray.push(
      {
        'uri' : randomURI,
        'verb' : randomVerb,
        'res' : {
          'statusCode': 200,
          'responseHeaders' : { 'Content-Type' : 'application/json' },
          'responseBody' : JSON.stringify({
            'VERB' : randomVerb,
            'URI' : randomURI,
            'RandomData' : JSON.stringify(staticJSON)
          })
        }
      });
  }
  return responseArray;
}



module.exports.returnResponsesForAllVerbs = returnResponsesForAllVerbs;
module.exports.returnNumResponses = returnNumResponses;
