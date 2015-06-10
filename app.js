var express = require('express');
var path = require('path');

var app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.set('port', process.env.PORT || 80);

var web_server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + web_server.address().port);
});

var clients = new Array();

var WebSocketServer = require('ws').Server
var wss = new WebSocketServer({ protocolVersion: 8, port: 8080 });

wss.on('connection', function connection(ws) {

  var url = ws.upgradeReq.url.replace('/', '');

  if( Object.prototype.toString.call( clients['ws_' + url] ) != '[object Array]' )
     clients['ws_' + url] = new Array();

  clients['ws_' + url].push(ws);

  ws.on('message', function incoming(message) {

    var js_message = JSON.parse(message);

    if (clients['ws_' + js_message.room] != null)
    {
      clients['ws_' + js_message.room].forEach(function each(client) {

        if (client != undefined)
           client.send(message);
      });

    }
  });

  ws.send('{"user":"Server","message":"Connected to the server..."}');
});


wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    client.send(data);
  });
};
