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
  //console.log(ws); 

  var url = ws.upgradeReq.url.replace('/', '');
  console.log(url); 
  clients['ws' + url] = new Array();
  clients['ws' + url].push(ws.upgradeReq.client);

  ws.on('message', function incoming(message) {
    //console.log(clients);
    wss.broadcast(message);
    //ws.send(message);
    
    console.log('received: %s', message);
  });

  ws.send('Hello');
});


wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    client.send(data);
  });
};
