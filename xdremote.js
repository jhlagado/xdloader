window.addEventListener('load', function load(event) {
    postMsg({
        name: 'remoteready',
    }, '*');
}, false);

window.addEventListener('message', function receiveMessage(e) {
    
    var msg = JSON.parse(e.data)
    if (msg.command == 'load') {
        var msg2 = {
            name: 'load.response',
            path: msg.path,
        };
        
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() 
        {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200 || xmlhttp.status == 0) {
                    msg2.result = 'ok';
                    msg2.data = JSON.parse(xmlhttp.responseText);
                } 
                else {
                    msg2.result = 'error';
                    msg2.errormsg = error;
                }
                postMsg(msg2, '*');
            }
        }
        xmlhttp.open("GET", msg.path, true);
        xmlhttp.send();


    //         $.getJSON(msg.path, function(data) {

    //         })
    //         .done(function(data) {
    //         })
    //         .fail(function(error) {
    //             msg2.result = 'error';
    //             msg2.errormsg = error;
    //             postMsg(msg2, '*');
    //         })
    }
    
    console.log('received message=' + msg);
}, false);

function postMsg(msg) {
    window.parent.postMessage(JSON.stringify(msg), '*');
}
