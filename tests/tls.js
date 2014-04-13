/**
 * simple.js - simple nossock test
 */

var fs = require('fs'),
    nossock = require('../lib/nossock');

var serverOpts = {
    type: 'tls',
    host: 'localhost',
    port: 8797,
    cert: fs.readFileSync(__dirname+'/certs/server.crt'),
    key : fs.readFileSync(__dirname+'/certs/server.key'),
    ca  : [fs.readFileSync(__dirname+'/certs/ca.crt')]
};

var clientOpts = {
    type: 'tls',
    host: 'localhost',
    port: 8797,
    cert: fs.readFileSync(__dirname+'/certs/client.crt'),
    key : fs.readFileSync(__dirname+'/certs/client.key'),
    ca  : [fs.readFileSync(__dirname+'/certs/ca.crt')]
};

module.exports = {

    'Test simple TLS two-way messages': function(test) {

        /* create server */
        var server = nossock.createServer(serverOpts, function(socket) {
            socket.on('hello', function(body) {
                test.equal(body, 'world', 'Server got what client sent');
                socket.send('bye', 'cruel world');
                socket.end();
                server.close();
            });
        }).listen(serverOpts.port);

        /* create client */
        nossock.createClient(clientOpts, function(socket) {

            socket.on('bye', function(body) {
                test.equal(body, 'cruel world', 'Client got what server responded');
                test.done();
            });
            socket.send('hello', 'world');
        });

    }
};
