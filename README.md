# xdloader
Cross-domain AJAX loader

This library retrieves JSON from servers anywhere on the web without 
running into the same-origin policy restriction in web browsers. It works
without the need for a server-side proxy by using the HTML5 postMessage() api.

To use xdloader you need to set up a host for your files. 
On that domain you also need to also to place a copy of the file xdremote.html

In your app code simply include xdloader.js 

To retrieve files, you create a "remote" object (one for each remote domain). 
Once created, you this to retrieve remote files from that domain.

#Promises
ES6 promise polyfill provided by:
https://github.com/taylorhakes/promise-polyfill
This can be removed when JavaScript in browsers moves to version 6 
and promises are suported natively.

#Example
```javascript

         //create a remote for the domain https://jhlagado.github.io/
         //create returns a promise
                
         xdloader.create('https://jhlagado.github.io/xdloader/remote/xdremote.html')

        .then(function(remote) {
            
            //got remote    
            //use it to get a file, and parse it as a JSON file 
            
            return remote.get('resource1.json', true)
            .then(function(response) {

                console.log(response.data.message);
            })
            .catch(function(error){

                console.log('ERROR: ' + error);
            })
        });
```

See demo:

https://jsfiddle.net/jhlagado/q5dr65bx/
