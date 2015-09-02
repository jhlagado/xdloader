# xdloader
Cross-domain JSON loader

This library retrieves JSON from servers anywhere on the web without 
running into the same-origin policy restriction in web browsers. 

To use you need to set up a remote server to host your JSON files. 
On that domain you also need to also host a copy of the file xdremote.html

In your apps code you just need to include xdloader.js and jquery. 
(Note: The xdloader library just uses JQuery for promises. I may remove this dependency 
on JQuery at some future stage.) 

In your code you need to create a remote object for each remote server needed 
by your app. Once you have a remote you can ask it to load JSON files from that domain

xdloader.create('http://jhlagado.github.io/xdloader/remote/xdremote.html')

.done(function(remote) {

    return remote.load('resource1.json')

        .done(function(data) {

            console.log(data.message);
        }
        .fail(function(error){

            console.error('ERROR: ' + error);
        })
}        
