# xdloader
Cross-domain AJAX loader

This library retrieves JSON from servers anywhere on the web without 
running into the same-origin policy restriction in web browsers. It works
without the need for a server-side proxy by using the HTML5 postMessage() api.

To use xdloader you need to set up a host for your files. 
On that domain you also need to also to place a copy of the file xdremote.html

In your app code simply just need to include xdloader.js and jquery. 
(Note: The xdloader library uses JQuery for promises. I may remove this dependency 
on JQuery at some future stage.) 

To retrieve files, you create a "remote" object (one for each remote domain). 
Once created, you this to retrieve remote files from that domain.



         xdloader.create('https://jhlagado.github.io/xdloader/remote/xdremote.html')

            .done(function(response) {

                console.log(response.data.message);
            })
            .fail(function(error){

                console.log('ERROR: ' + error);
            })


See demo:

https://jsfiddle.net/jhlagado/7hgdoj0z/