var express = require("express");
var app = express();
var http = require("http");
var path = require('path');

var server = http.createServer(app);
var io = require('socket.io').listen(server);  //pass a http.Server instance

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/html')));
app.use(express.static(path.join(__dirname, 'public/css')));
app.use(express.static(path.join(__dirname, 'public/js')));
app.use(express.static(path.join(__dirname, 'public/img')));

server.listen(8080);  //listen

// routing
app.get('/client', function (req, res) {
    res.sendfile(__dirname + '/public/html/clientchat.html');
});

app.get('/executive', function (req, res) {
    res.sendfile(__dirname + '/public/html/executivechat.html');
});
module.exports.sockets = sockets = io.sockets.on('connection', require('./routes/socket'));
module.exports.io = io;
module.exports = app;