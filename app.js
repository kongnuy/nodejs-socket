'use strict';

const express = require('express');

const app = express();
const http = require('http').createServer(app)
const socketio = require('socket.io')(http)
var cors = require('cors')
app.use(cors());

app.get('/', (req, res) => {
  res.status(200).send('Node Server is running. Yay!! \n <a href="/chat">Aller au chat</a>').end();
});
app.get('/chat', function(req, res){
  res.sendFile(__dirname + '/index.html');
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
