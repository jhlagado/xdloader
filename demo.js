'use strict';

window.addEventListener('load', function load(event) {
    
    xdloader.create('file:///home/jh/work/xdloader/xdremote.html').done(function(remote) {
        remote.load('resource.json').done(function(result) {
            console.log('RESULT', result.message)
        }); 
    })

}, false);
