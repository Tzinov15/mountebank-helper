const randomWords = require('random-words');


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



/*function returnNumResponses(num) {
  const responseArray = [];
  const verbArray = ['GET', 'POST', 'PUT', 'DELETE'];
  for (var i = 0; i < num; i++) {
    var randomURI = `/${randomWords()}`;
    verbArray.forEach(function (verb) {
      responseArray.push(
        {
          'uri' : randomURI,
          'verb' : verb,
          'res' : {
            'statusCode': 200,
            'responseHeaders' : { 'Content-Type' : 'application/json' },
            'responseBody' : JSON.stringify({
              'VERB' : verb,
              'URI' : randomURI
            })
          }
        });

    });
  }
  return responseArray;
}
*/

module.exports.returnResponsesForAllVerbs = returnResponsesForAllVerbs;
//module.exports.returnNumResponses = returnNumResponses;
