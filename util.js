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


module.exports.returnResponsesForAllVerbs = returnResponsesForAllVerbs;
