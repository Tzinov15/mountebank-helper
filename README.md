<h1> _MountebankHelper </h1>
<hr>
A simple Javascript wrapper to easily interface with Mountebank and not have to deal with its
unintuitive object structure requirements.



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
  "uri" : /some_uri,      //URI against which we are maching an incoming request
  "verb" : GET,           // HTTP method against which we are matching an incoming request
  "res" :                 // The response that is to be returned when the above conditions get met
    {
      "statusCode" : 200,        
      "responseHeaders" : {"Content-Type" : "application/json"},  
      "responseBody" : JSON.stringify({"hello" : "world"})
    }           
}```

<h3>Imposter.postToMountebank()</h3>
Makes the actual POST request to the instance of mountebank running on localhost:2525 in order to setup the listening Imposter. Returns a Promise that resolves to the response returned from the Mountebank server

<h3>Imposter.updateResponseBody(newBody, pathToUpdate)</h3>
<h5>newBody</h5>
The content of the new body that is to be returned by the imposter. Must be a string
<h5>pathToUpdate</5>
<h3>Imposter.updateResponseCode()</h3>
<h3>Imposter.updateResponseHeaders()</h3>
