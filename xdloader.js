'use strict';

(function(root, factory) {
    
    if (typeof exports === 'object' && exports) {
        factory(exports); // CommonJS
    } else {
        var lib = {};
        factory(lib);
        if (typeof define === 'function' && define.amd)
            define(lib); // AMD
        else
            root[lib.name] = lib; // <script>
    }

}(this, function(lib) {
    
    lib.name = 'xdloader';
    lib.version = '0.0.0';
    
    lib.create = create;
    
    var remotes = {};
    var deferreds = {};
    
    var body = document.getElementsByTagName('body')[0];
    
    window.addEventListener('message', function(e) {
        var remote = remotes[e.origin];
        if (!remote)
            return;
        var msg = JSON.parse(e.data);
        if (msg.name === 'remoteready') {
            if (!remote.source) {
                remote.source = e.source;
                remote.deferred.resolve(remote);
            }
        } 
        else if (msg.name == 'load.response') {
            var rc = deferreds[msg.path];
            deferreds[msg.path] = null;
            if (rc) {
                if (msg.result == 'ok')
                    rc.resolve(msg.data);
                else
                    rc.reject(msg.result);
            }
        }
    }, false);
    
    function create(loaderurl) {
        var url = new URL(loaderurl);
        var origin = url.protocol + "//" + url.hostname + 
        (url.port ? ':' + url.port : '');
        var path = url.pathname;
        var remote = remotes[origin];
        if (remote)
            return remote;
        remote = new Remote(origin, path);
        remotes[origin] = remote;
        return remote.deferred;
    }
    
    function Remote(origin, path) {
        
        this.deferred = $.Deferred();
        
        var element = document.createElement('iframe');
        element.src = origin + path;
        element.width = '1';
        element.height = '1';
        element.seamless = 'seamless';
        element.frameBorder = '0';
        element.scrolling = 'no';
        
        body.appendChild(element);
        
        this.load = function(path1) {
            if (!this.source)
                return;
            var rc = deferreds[path1];
            if (!rc) {
                rc = $.Deferred();
                deferreds[path1] = rc;
                var msg = JSON.stringify({
                    command: 'load',
                    path: path1,
                });
                this.source.postMessage(msg, origin);
            }
            return rc.promise();
        }
        
        this.destroy = function() {
            body.removeElement(remote.element);
            remotes[origin] = null;
        }
    }

}));

