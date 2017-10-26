module.exports.samplePredicate = {
  equals: {
    method: 'get',
    path: '/newpage' }
};

module.exports.sampleReponse = {
  is: {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 'hello' : 'world' })
  }
};
