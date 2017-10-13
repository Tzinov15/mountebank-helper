const randomWords = require('random-words');


function returnResponsesForAllVerbs(uri, predicates) {

  const verbArray = ['GET', 'POST', 'PUT', 'DELETE'];
  const responseArray = [];

  verbArray.forEach(function (verb) {
    let response = {
      'uri': uri,
      'verb': verb,
      'res': {
        'statusCode': 200,
        'responseHeaders': {
          'Content-Type': 'application/json'
        },
        'responseBody': JSON.stringify({
          [uri]: verb
        })
      }
    };
    if (predicates && predicates.length > 0) {
      response.predicates = predicates
    }

    responseArray.push(response);
  })
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
