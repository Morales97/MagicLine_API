// importing the dependencies
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var fs = require('fs');
var https = require('https');
var privateKey  = fs.readFileSync('ssl_back_end/server.key');
var certificate = fs.readFileSync('ssl_back_end/server.crt');
var credentials = {key: privateKey, cert: certificate, passphrase: 'magiclineSSL'};

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

// Create an HTTPS server, using SSL key generated for local use only
// REMOVE FOR PRODUCTION
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(port);

console.log('listening on port 3000');
