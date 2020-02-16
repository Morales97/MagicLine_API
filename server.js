// importing the dependencies
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var fs = require('fs');
var http = require('http');

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

var httpServer = http.createServer(app);
httpServer.listen(port);

console.log('listening on port 3000');
