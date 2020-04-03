// Copyright 2017 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

// [START gae_node_request_example]
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
     console.log('message: ' + msg);
     userSocket.broadcast.emit('chat message', msg)
    });
    userSocket.on("send_message", (data) => {
        console.log(JSON.stringify(data))
        userSocket.broadcast.emit("receive_message", data)
    })
})

// Start the server
const PORT = process.env.PORT || 8080;
http.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END gae_node_request_example]

module.exports = app;
