// Dependencies
const express = require('express');
const http = require('http');
const https = require('https');
const fs = require('fs');
const socketIO = require('socket.io');
const os = require('os');
const cluster = require('cluster');

// Constants
const PORT = process.env.PORT || 443; // Default port
const clusterWorkerSize = os.cpus().length; // Number of CPU cores

// HTTPS options
const options = {
  key: fs.readFileSync('private.key.pem'), // Private key file
  cert: fs.readFileSync('domain.cert.pem'), // Domain certificate file
  ca: fs.readFileSync('intermediate.cert.pem'), // Intermediate certificate file
  rejectUnauthorized: true // Reject unauthorized connections
};

// Initialization
var app = express();
var server = https.createServer(options, app); // Create HTTPS server
var io = socketIO(server); // Initialize socket.io

// Express settings
app.set('port', PORT); // Set port
app.set('view engine', 'ejs'); // Set view engine to ejs

// Static file middleware
app.use('/node_modules', express.static(__dirname + '/node_modules')); // Serve node_modules
app.use('/public', express.static(__dirname + '/public')); // Serve public files
app.use('/shared', express.static(__dirname + '/shared')); // Serve shared files
app.use('/privacy', express.static(__dirname + '/views/privacy.html')); // Serve privacy policy
app.use('/contact', express.static(__dirname + '/views/contact.html')); // Serve contact page
app.use('/ads.txt', express.static(__dirname + '/views/ads.txt')); // Serve ads.txt file
app.use('/', express.static(__dirname + '/views')); // Serve views directory

// Redirect all HTTP requests to HTTPS
app.get('*', function (request, response) {
  response.redirect("https://" + request.headers.host); // Redirect to HTTPS
});

// Cluster management
if (clusterWorkerSize > 1) {
  if (cluster.isMaster) {
    // Fork workers
    for (let i = 0; i < clusterWorkerSize; i++) {
      cluster.fork(); // Fork a worker
    }
    cluster.on("exit", function (worker) {
      console.log("Worker", worker.id, "has exited."); // Log worker exit
    });
  } else {
    // Worker processes
    console.log(`Established auto redirect to secure network - worker ${process.pid}`);
    http.createServer(function (request, response) {
      response.writeHead(302, { "Location": "https://" + request.headers['host'] + request.url }); // Redirect to HTTPS
      response.end();
    }).listen(80); // Listen on port 80 for HTTP
    server.listen(PORT, function () {
      console.log(`Express server listening on port ${PORT} - worker ${process.pid}`);
    });
  }
} else {
  // Single worker
  console.log(`Established auto redirect to secure network - worker ${process.pid}`);
  http.createServer(function (request, response) {
    response.writeHead(302, { "Location": "https://" + request.headers['host'] + request.url }); // Redirect to HTTPS
    response.end();
  }).listen(80); // Listen on port 80 for HTTP
  server.listen(PORT, function () {
    console.log(`Express server listening on port ${PORT} - single worker ${process.pid}`);
  });
}
