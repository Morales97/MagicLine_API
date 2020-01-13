// importing the dependencies
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('ssl_local/server.key');
var certificate = fs.readFileSync('ssl_local/server.crt');
var credentials = {key: privateKey, cert: certificate};

// defining the Express app
const app = express(),
  User = require('./api/models/models'),
  port = process.env.PORT || 3000;

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/magicline', function(err){
  console.log("connecting to mongoDB")
  if(err)
    throw err
    ;
  console.log("Connectat amb èxit!");
});

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// register routes
var routes = require('./api/routes/routes'); 
routes(app); 

// Create an HTTP server and an HTTPS server, using SSL key generated for local use only
// REMOVE FOR PRODUCTION
var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(3001);
httpsServer.listen(port);

// start the server
//app.listen(port) 
console.log('listening on port 3000');
