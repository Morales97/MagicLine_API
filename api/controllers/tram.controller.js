var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Tram = mongoose.model('Tram');
const config = require('../../common/env.config');
const OPEN = config.tramStates.OPEN;
const CLOSED = config.tramStates.CLOSED;

// Insert a new tram
exports.insert = (req, res) => {
    // set permission level
    req.body.state = CLOSED;

    // save tram
    var new_tram = new Tram(req.body);
    new_tram.save(function(err, tram){
        if (err) res.send(err);
        res.send(tram);
    });
 };

// Get list of all trams
exports.getAll = (req, res) => {
    Tram.find({}, function(err, trams) {
    if (err) res.send(err);
        res.json(trams);
    });
};

// Find a tram by _id
exports.getBy_Id = (req, res) => {
    Tram.findById(req.params.tramId, function(err, tram){
        if (err) res.send(err);
        tram = tram.toJSON();
        res.send(tram);
    });
}

// Find a tram by num_id
exports.getByNumId = (req, res) => {
    Tram.find({num_id: req.params.tramId}, function(err, tram){
        if (err) res.send(err);
        tram = tram.toJSON();
        res.send(tram);
    });
}

// Find tram assigned to user
exports.getOwnTram = (req, res) => {
    let userId = req.jwt.userId
    User.findById(userId, function(err, user){
        if (err) res.send(err);
        let tramNumId = user.tram_num_id;
        Tram.find({num_id: tramNumId}, function(err, tram){
            if (err) res.send(err);
            tram = tram.toJSON();
            res.send(tram);
        });
    })
}

// Delete tram 
exports.deleteBy_Id = (req, res) => {
    Tram.deleteOne({_id: req.params._id}, function(err, result){
        if (err) res.send(err);
        res.status(204).send({});   // send status 204 to indicate successfull
    });
}

// Patch tram state
exports.patchTramState = (req, res) => {
    Tram.find({num_id: req.params.numTram}, function (err, tram) {
        if (err) res.send(err);
        tram.state = req.body.state;
        tram.save(function (err, updatedTram) {
            if (err) res.send(err);
            res.send(updatedTram);
        });
    });
}

// Open tram - igual q patch però predefinit per obrir, aixi no cal request body
exports.openTram = (req, res) => {
    Tram.find({num_id: req.params.numTram}, function (err, tram) {
        if (err) res.send(err);
        tram.state = OPEN;
        tram.save(function (err, updatedTram) {
            if (err) res.send(err);
            res.send(updatedTram);
        });
    });
}

// Close tram 
exports.closeTram = (req, res) => {
    Tram.find({num_id: req.params.numTram}, function (err, tram) {
        if (err) res.send(err);
        tram.state = CLOSED;
        tram.save(function (err, updatedTram) {
            if (err) res.send(err);
            res.send(updatedTram);
        });
    });
}