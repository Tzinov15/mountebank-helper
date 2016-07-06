<h1> MountebankHelper </h1>


[![Build Status](https://travis-ci.org/Tzinov15/mountebank-helper.svg?branch=master)](https://travis-ci.org/Tzinov15/mountebank-helper)
[![Coverage Status](https://coveralls.io/repos/github/Tzinov15/mountebank-helper/badge.svg?branch=master&bust=1)](https://coveralls.io/github/Tzinov15/mountebank-helper?branch=master)



A simple Javascript wrapper to easily interface with <a href = 'http://www.mbtest.org/'>Mountebank</a> and not have to deal with its
abstract object structure requirements. <br><br>

While not providing an API for the full feature list that mountebank has, MountebankHelper provides enough functionality so that it reflects the core purpose of Mountebank and is easy to use at the same time. <br>

In the future this library will probably become a full-fledged Javascript wrapper around several of Mountebanks powerful CLI commands


<h1> Usage </h1>


```javascript

// import the mountebank helper library
const mbHelper = require('mountebank-helper');

// create the skeleton for the imposter (does not post to MB)
const firstImposter = new mbHelper.Imposter({ 'imposterPort' : 3000 });

// construct sample responses and conditions on which to send it
const sample_response = {
  'uri' : '/hello',
  'verb' : 'GET',
  'res' : {
    'statusCode': 200,
    'responseHeaders' : { 'Content-Type' : 'application/json' },
    'responseBody' : JSON.stringify({ 'hello' : 'world' })
  }
};

const another_response = {
  'uri' : '/pets/123',
  'verb' : 'PUT',
  'res' : {
    'statusCode': 200,
    'responseHeaders' : { 'Content-Type' : 'application/json' },
    'responseBody' : JSON.stringify({ 'somePetAttribute' : 'somePetValue' })
  }
};


// add our responses to our imposter
firstImposter.addRoute(sample_response);
firstImposter.addRoute(another_response);

// start the MB server  and post our Imposter to listen!
mbHelper.startMbServer(2525)
.then(function() {
  firstImposter.postToMountebank()
  .then( () => {
  console.log('Imposter Posted! Go to http://localhost:3000/hello');
  });
});

```

Now you can navigate to <a href = 'http://localhost:3000/hello'>localhost:3000/hello</a> to see the mocked response!

<h1>API</h1>

<h3>MountebankHelper.startMbServer(port)</h3>
<h5> port </h5> The port on which the main Mountebank server is to listen on
This will start up the main Mountebank server and have it start listening for imposter create/update requests. This must be called before making any postToMountebank or updateResponse calls

<h3>MountebankHelper.Imposter(port, protocol)</h3>
Constructor for the Imposter class which serves as the main entry point for interacting with Mountebank. <br>
A single instance of an Imposter class represents a single Mountebank imposter listening on a single port. <br>
<h5> port </h5> The port on which the Imposter is to listen on for incoming traffic
<h5> protocol </h5> The protocol the Imposter is to run on

<h3>Imposter.addRoute(responseObject)</h3>
Adds a new <b> stub </b> to the imposter. A stub represents a combination of a predicate (conditions to be met) and a response (the response to be returned when those conditions are met). <br>
This library only provides functionality for the <b>equals</b> predicate meaning, only complete response matches can be used as a predicate. See usage at end of README

<h5> responseObject </h5>

```javascript
{
  "uri" :  some_uri,      // URI against which we are matching an incoming request
  "verb" : GET,           // HTTP method against which we are matching an incoming request
  "res" :                 // The response that is to be returned when the above conditions get met
    {
      "statusCode" : 200,        
      "responseHeaders" : {"Content-Type" : "application/json"},  
      "responseBody" : JSON.stringify({"hello" : "world"})
    }           
}
```

<h3>Imposter.postToMountebank()</h3>
Makes the actual POST request to the instance of mountebank running on localhost:2525 in order to setup the listening Imposter. Returns a Promise that resolves to the response returned from the Mountebank server

<h3>Imposter.updateResponseBody(newBody, pathToUpdate)</h3>
<h5>newBody</h5>
The content of the new body that is to be returned by the imposter. Must be a string
<h5>pathToUpdate</h5>
```javascript
{
  "uri" :  some_uri,      // URI of the response you wish to update
  "verb" : GET           // HTTP Method of the response you wish to update
}
```

<h3>Imposter.updateResponseCode(newCode, pathToUpdate)</h3>
<h5>newCode</h5>
The new status code that is to be returned by the imposter. Must be a string
<h5>pathToUpdate</h5>
```javascript
{
  "uri" :  some_uri,      // URI of the response you wish to update
  "verb" : GET           // HTTP Method of the response you wish to update
}
```

<h3>Imposter.updateResponseHeaders(newHeaders, pathToUpdate)</h3>
<h5>newHeaders</h5>
The content of the new headers that is to be returned by the imposter. Must be a string
<h5>pathToUpdate</h5>
```javascript
{
  "uri" :  some_uri,      // URI of the response you wish to update
  "verb" : GET           // HTTP Method of the response you wish to update
}
```

<h2> Functionality / Features Not Yet Implemented </h2>
<ul>
<li> Support for fuzzy matching (via regex) on incoming-request body content (as opposed to exact path match) [DONE] </li> 
<li> Include the process of starting the Mountebank server as part of existing Functionality (abstract it away from the client so they don't have to call startMbServer() )
<li> Travis CI Build Setup [DONE] </li>
<li> Post to NPM as installable module [DONE] </li>
<li> Increase Code Coverage to 95% </li>
</ul>
