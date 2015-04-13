var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
var parser = new require('xml2json');
var fs = require('fs');

// Server created at port 8000
app.listen(8000);

console.log('Server listening on localhost:8000');

// On server start, we load our client.html page
function handler(req, res) {
    fs.readFile(__dirname + '/client.html', function (err, data) {
        if (err) {
            console.log(err);
            res.writeHead(500);
            return res.end('Error loading client.html');
        }
        res.writeHead(200);
        res.end(data);
    });
}

// Creating a new websocket to keep the content updated without any AJAX request
io.sockets.on('connection', function (socket) {
    console.log(__dirname);
    // Watching the xml file
    fs.watchFile(__dirname + '/example.xml', function (curr, prev) {
        // On file change we read the new xml
        fs.readFile(__dirname + '/example.xml', function (err, data) {
            if (err) throw err;
            // Parse the new xml data and convert them into json file
            var json = parser.toJson(data);
            // Send new data to the client
            socket.volatile.emit('notification', json);
        });
    });

});