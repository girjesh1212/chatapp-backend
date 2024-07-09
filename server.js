const path = require('path');
const cors = require('cors');
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: false, limit: '100mb' }));
app.use(express.json({ limit: '100mb' }));
app.options('*', cors());
app.use(cors());

// Socket server
const { Server } = require("socket.io");
const server = require('http').createServer(app);
const io = new Server(server);

// Utils function
const { handleSocketMessage, socketSession } = require('./utils');


// Socket handler
io.use(socketSession)
  .on('connection', (client) => {

    client.on('disconnect', () => { });

    client.on('message', async (msg) => {
      const emitMessage = await handleSocketMessage(msg, client.username, client.token);
      if (emitMessage != null) {
        client.emit('returnMessage', emitMessage);
      }
    })
  });


// Serve Frontend
app.use(express.static(path.join(__dirname, 'web')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'web', 'index.html'));
});


// Start server
server.listen(3000, () => {
  console.log('server started on port 3000');
});

server.timeout = 10000;