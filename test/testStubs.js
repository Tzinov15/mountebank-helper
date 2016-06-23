module.exports.samplePredicate = {
  equals: {
    method: 'get',
    path: '/newpage' }
};

module.exports.sampleReponse = {
  is: {
    statuscode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 'hello' : 'world' })
  }
};
