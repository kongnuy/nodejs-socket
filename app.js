'use strict';

const express = require('express');
const app = express();
const http = require('http').createServer(app)

const socketio = require('socket.io')(http,  {
    handlePreflightRequest: (req, res) => {
        const headers = {
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Origin": req.headers.origin, //or the specific origin you want to give access to,
            "Access-Control-Allow-Credentials": true
        };
        res.writeHead(200, headers);
        res.end();
    }
});

//var cors = require('cors')
//app.use(cors());
app.use(function (req, res, next) {
  console.log('Time:', Date.now());
  console.log(req.originalUrl);
  next();
});

app.get('/', (req, res) => {
  res.status(200).send('Node Server is running. Yay!! \n <a href="/chat">Aller au chat</a>').end();
});

app.get('/chat', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.use((socket, next) => {
  let handshake = socket.handshake;
  console.log("----- Socket info -----");
  console(handshake.url)
  console(handshake.address)
  console(handshake.headers)
  console.log("----- end of Socket info -----");

});

socketio.on("connection", (userSocket) => {
    userSocket.on('chat message', function(msg){
      if (typeof msg === "object") {
        try {
          console.log('message: ' + msg.message);
          userSocket.broadcast.emit('chat message', msg.message)
        } catch (error) {
          console.log(error)
        }
      } else {
        console.log('message: ' + msg);
        userSocket.broadcast.emit('chat message', msg)
      }
    });
    userSocket.on("send_message", (data) => {
        console.log(JSON.stringify(data))
        userSocket.broadcast.emit("receive_message", data)
    })
})

const PORT = process.env.PORT || 8080;
http.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

module.exports = app;
