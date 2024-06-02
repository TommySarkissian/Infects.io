// Dependencies
const express = require('express');
const https = require('https');
const fs = require('fs');
const socketIO = require('socket.io');
const Game = require('./lib/Game');
const os = require('os');
const cluster = require('cluster');
require('events').EventEmitter.defaultMaxListeners = 0; // Set max listeners to unlimited

// Constants
const FPS = 60; // Frames per second
const PORT = process.env.PORT || 6900; // Default port
const ORIGIN = 'https://localhost'; // Origin for CORS, change to production server
const clusterWorkerSize = os.cpus().length; // Number of CPU cores
const server_port = [{ "port": 6901, "status": 0, "pc": 0 }]; // Initial server port configuration
var max_players = 25; // Maximum number of players

// HTTPS options
const options = {
  key: fs.readFileSync('private.key.pem'), // Private key file
  cert: fs.readFileSync('domain.cert.pem'), // Domain certificate file
  ca: fs.readFileSync('intermediate.cert.pem'), // Intermediate certificate file
  rejectUnauthorized: true // Reject unauthorized connections
};

// Initialization function
function init() {
  setTimeout(function () {
    if (server_port[id].status > 1 || server_port[id].pc == max_players) { // Check if server is full
      if (typeof server_port[id + 1] === 'undefined') { // Create new server if needed
        server_port.push({ "port": server_port[id].port + 1, "status": 0, "pc": 0 });
        start(server_port[id].port + 1); // Start new server
      } else {
        id = id + 1; // Move to next server
      }
    } else {
      purge(); // Purge unused servers
      id = 0; // Reset server index
    }
    init(); // Recursively call init
  }, 1000);
}

// Delay function to reset purge status
function delay() {
  setTimeout(function () {
    if (purgeInProgress == true) {
      purgeInProgress = false; // Reset purge flag
    }
  }, 30000); // 30 seconds delay
}

// Purge function to clean up unused servers
function purge() {
  if (server_port[server_port.length - 1].port != server_port[0].port && purgeInProgress == false) {
    purgeInProgress = true; // Set purge flag
    if (server_port[server_port.length - 1].status == 0) {
      server_port.pop(); // Remove last server if not in use
    }
    delay(); // Call delay to reset purge flag
  }
}

// Start the server and game
function start(port) {
  var app = express();
  var server = https.createServer(options, app);
  var io = socketIO(server, {
    pingInterval: 10000, // Ping interval for WebSocket
    pingTimeout: 5000, // Ping timeout for WebSocket
    rememberTransport: false, // Disable transport memory
    transports: ['websocket', 'Flash Socket', 'AJAX long-polling'], // Transport methods
    cors: {
      origin: ORIGIN, // Set CORS origin
      methods: ["GET", "POST"] // Allowed methods
    }
  });

  var game = Game.create(); // Create game instance
  var state = "0"; // Initial game state

  app.set('port', port); // Set port

  app.setMaxListeners(Infinity); // Set max listeners to unlimited

  // Root route
  app.get('/', function (request, response, next) {
    response.setHeader('Access-Control-Allow-Origin', ORIGIN); // Set CORS header
    response.setHeader('Access-Control-Allow-Methods', 'GET'); // Set allowed methods
    response.send(state); // Send game state
  });

  // Handle WebSocket connections
  io.on('connection', (socket) => {
    socket.on('ping', function () {
      socket.emit('pong'); // Respond to ping
    });

    socket.on('player-join', (data) => {
      if (game.status <= 1 && game.players.size < max_players) { // Check player limit
        game.addNewPlayer(socket, data); // Add new player
      }
      if (game.status <= 1 && (port == 6901 || port == 6902)) {
        game.addBot("@bot1x"); // Add bots
        game.addBot("@bot2y");
        game.addBot("@bot3x");
        game.addBot("@bot4y");
        game.addBot("@bot5x");
        game.addBot("@bot6y");
      }
    });

    socket.on('player-action', (data) => {
      if (game.players.size >= 3 && game.status == 2) { // Check game status
        game.updatePlayerOnInput(socket.id, data); // Update player based on input
      }
    });

    socket.on('disconnect', () => {
      if (game.players.size != 0) {
        game.removePlayer(socket.id); // Remove player on disconnect
      }
    });
  });

  // Server-side game loop running at 60 FPS
  var tickLengthMs = 1000 / FPS; // Length of each game tick
  var previousTick = Date.now(); // Previous tick time
  var actualTicks = 0; // Actual tick counter

  var gameLoop = function () {
    var now = Date.now(); // Current time

    actualTicks++;
    if (previousTick + tickLengthMs <= now) {
      var delta = (now - previousTick) / 1000; // Time since last tick
      previousTick = now; // Update previous tick time

      update(delta); // Update game state

      actualTicks = 0; // Reset actual tick counter
    }

    if (Date.now() - previousTick < tickLengthMs - 16) {
      setTimeout(gameLoop); // Use setTimeout for next tick
    } else {
      setImmediate(gameLoop); // Use setImmediate for next tick
    }
  };

  // Update game state
  var update = function (delta) {
    state = game.status.toString(); // Update game status
    game.update(); // Update game logic
    game.sendState(); // Send game state to clients
    if (server_port.findIndex(x => x.port === port) === -1) {
      server.close(); // Close server if port not found
    } else {
      server_port[server_port.findIndex(x => x.port === port)].status = game.status; // Update server status
      server_port[server_port.findIndex(x => x.port === port)].pc = game.players.size; // Update player count
    }
  };

  gameLoop(); // Start game loop

  // Start the server
  server.listen(port, function () {
    console.log(`Express server listening on port ${port} - worker ${process.pid}`);
  });
}

// Cluster management
if (clusterWorkerSize > 1) {
  if (cluster.isMaster) {
    for (let i = 0; i < clusterWorkerSize; i++) {
      cluster.fork(); // Fork workers
    }
    cluster.on("exit", function (worker) {
      console.log("Worker", worker.id, "has exited."); // Log worker exit
    });
  } else {
    var app = express();
    var server = https.createServer(options, app);
    app.set('port', PORT); // Set port
    app.get('/', function (request, response, next) {
      response.setHeader('Access-Control-Allow-Origin', ORIGIN); // Set CORS header
      response.setHeader('Access-Control-Allow-Methods', 'GET'); // Set allowed methods
      response.send(JSON.stringify(server_port)); // Send server port info
    });
    server.listen(PORT, function () {
      console.log(`Express server listening on port ${PORT} - worker ${process.pid}`);
    });
    var purgeInProgress = false; // Purge flag
    var id = 0; // Initial server index
    init(); // Initialize servers
    start(server_port[id].port); // Start initial server
  }
} else {
  var app = express();
  var server = https.createServer(options, app);
  app.set('port', PORT); // Set port
  app.get('/', function (request, response, next) {
    response.setHeader('Access-Control-Allow-Origin', ORIGIN); // Set CORS header
    response.setHeader('Access-Control-Allow-Methods', 'GET'); // Set allowed methods
    response.send(JSON.stringify(server_port)); // Send server port info
  });
  server.listen(PORT, function () {
    console.log(`Express server listening on port ${PORT} - worker ${process.pid}`);
  });
  var purgeInProgress = false; // Purge flag
  var id = 0; // Initial server index
  init(); // Initialize servers
  start(server_port[id].port); // Start initial server
}
