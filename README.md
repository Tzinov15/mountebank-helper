<h1> _MountebankHelper </h1>
A simple Javascript wrapper to easily interface with Mountebank and not have to deal with its
unintuitive object structure requirements.



<h1> Usage </h1>


```javascript

// import the mountebank helper library
const lrMB = require('./lr-mb');

// create the skeleton for the imposter (does not post to MB)
const firstImposter = new lrMB.Imposter(3000, 'http');

// construct sample responses and conditions on which to send it
const sample_response = {
  'uri' : /hello,
  'verb' : GET,
  'res' : {
    'statusCode': 200,
    'responseHeaders' : { 'Content-Type' : 'application/json' },
    'responseBody' : JSON.stringify({ 'hello' : 'world' })
  }
};

const another_response = {
  'uri' : /pets/123,
  'verb' : PUT,
  'res' : {
    'statusCode': 200,
    'responseHeaders' : { 'Content-Type' : 'application/json' },
    'responseBody' : JSON.stringify({ 'somePetAttribute' : 'somePetValue' })
  }
};


// add our responses to our imposter
firstImposter.addRoute(sample_response);
firstImposter.addRoute(another_response);

// start the MB server (defaults to port 2525) and post our Imposter to listen!
lrMB.startMbServer()
.then(function() {
  firstImposter.postToMountebank();
});

```

<h1>API</h1>


<h3>lr_MB.Imposter(port, protocol)</h3>
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
<li> Support for fuzzy matching (via regex) on incoming-request body content (as opposed to exact path match) </li>
<li> Include the process of starting the Mountebank server as part of existing Functionality (abstract it away from the client so they don't have to call startMbServer() )
<li> Travis CI Build Setup </li>
<li> Post to NPM as installable module </li>
</ul>
