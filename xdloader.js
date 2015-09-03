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
            if (remote.deferred) {
                remote.source = e.source;
                remote.deferred.resolve(remote);
                remote.deferred = null;
            }
        } 
        else if (msg.name == 'load.response') {
            var def = deferreds[msg.path];
            deferreds[msg.path] = null;
            if (def) {
                if (msg.result == 'ok')
                    def.resolve(msg.data);
                else
                    def.reject(msg.result);
            }
        }
        else if (msg.name == 'ajax.response') {
            var def = deferreds[msg.id];
            deferreds[msg.id] = null;
            if (def) {
                var result = {
                    data: msg.data,
                    statuscode: msg.statuscode,
                }
                if (msg.statuscode == 200)
                    def.resolve(result);
                else {
                    result.error = msg.error;
                    def.reject(result);
                }
            }
        }
    }, false);
    
    function create(loaderurl) {
        var parser = document.createElement('a');
        parser.href = loaderurl;
        var origin = parser.protocol + '//' + parser.hostname;
        var path = parser.pathname;
        if (path[0] != '/') path = '/' + path;

        var remote = remotes[origin];
        if (remote)
            return remote;
        remote = new Remote(origin, path);
        remotes[origin] = remote;
        return remote.deferred;
    }
    
    function Remote(origin, path, timeout) {
        
        if (!timeout) timeout = 10000;

        this.deferred = $.Deferred();

        var element = document.createElement('iframe');
        element.src = origin + path;
        element.width = '1';
        element.height = '1';
        element.seamless = 'seamless';
        element.frameBorder = '0';
        element.scrolling = 'no';
        
        body.appendChild(element);

        var remote = this;
        setTimeout(function(){
            if (remote.deferred) {
                remote.deferred.reject('Could not create remote');
                remote.deferred = null;
            }
        }, timeout);
        
        this.load = function(path) {
            if (!this.source)
                return;
            var def = deferreds[path];
            if (!def) {
                def = $.Deferred();
                deferreds[path] = def;
                var msg = JSON.stringify({
                    command: 'load',
                    path: path,
                });
                this.source.postMessage(msg, origin);
            }
            return def.promise();
        }
        
        this.ajax = function(method, path, data, headers) {
            if (!this.source)
                return;
            var id = String(Date.now());    
            var def = deferreds[path];
            if (!def) {
                def = $.Deferred();
                deferreds[path1] = def;
                var msg = {
                    command: 'ajax',
                    id: id,
                    method: method,
                    path: path,
                    data: data,
                };
                if (headers) msg.headers = headers;
                
                this.source.postMessage(JSON.stringify(msg), origin);
            }
            return def.promise();
        }

        this.destroy = function() {
            body.removeElement(remote.element);
            remotes[origin] = null;
        }
    }

}));
