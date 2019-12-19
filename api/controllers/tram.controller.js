var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Tram = mongoose.model('Tram');
const config = require('../../common/env.config');
const OPEN = config.tramStates.OPEN;
const CLOSED = config.tramStates.CLOSED;

// FUNCIONA
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

// FUNCIONA
// Get list of all trams sorted
exports.getAll = (req, res) => {
    Tram.find({}, {_id: 0, name: 1, num_id: 1, state: 1}, function(err, trams) {
    if (err) res.send(err);
        res.json(trams);
    }).sort({num_id: 1});
};

// FUNCIONA
// Find a tram by num_id
exports.getByNumId = (req, res) => {
    Tram.findOne({num_id: req.params.tramNumId}, function(err, tram){
        if (err) res.send(err);
        tram = tram.toJSON();
        res.send(tram);
    });
}

// FUNCIONA
// Find a tram by _id
exports.getBy_Id = (req, res) => {
    Tram.findById(req.params.tramId, function(err, tram){
        if (err) res.send(err);
        tram = tram.toJSON();
        res.send(tram);
    });
}

// FUNCIONA
// Find tram assigned to user
exports.getOwnTram = (req, res) => {
    let userId = req.jwt.userId
    User.findById(userId, function(err, user){
        if (err) res.send(err);
        let tramNumId = user.tram_num_id;
        Tram.findOne({num_id: tramNumId}, function(err, tram){
            if (err) res.send(err);
            tram = tram.toJSON();
            res.send(tram);
        });
    })
}

// FUNCIONA
// Delete tram 
exports.deleteBy_Id = (req, res) => {
    Tram.deleteOne({_id: req.params.tramId}, function(err, result){
        if (err) res.send(err);
        res.status(204).send({});   // send status 204 to indicate successfull
    });
}

// FUNCIONA
// Canvia estat - funció de suport
changeState = (req, res, state) => {
    // 1. Trobem el _id a partir del num_id
    Tram.findOne({num_id: req.params.tramNumId}, '_id', function (err, _id) {
        if (err) res.send(err);
        // 2. Trobem el tram i el modifiquem
        // Motiu: només findById retorna un objecte Tram que permet fer tram.save
        Tram.findById(_id, function (err, tram) {
            if (err) res.send(err);
            tram.state = state;
            tram.save(function (err, updatedTram) {
                if (err) res.send(err);
                res.send(updatedTram);
            });
        }); 
    });
}

// FUNCIONA
// Patch tram state
exports.patchTramState = (req, res, state) => {
    changeState(req, res, req.body.state);
}

// FUNCIONA
// Open tram 
exports.openTram = (req, res) => {
    console.log("open tram")
    changeState(req, res, OPEN);
}

// FUNCIONA
// Close tram 
exports.closeTram = (req, res) => {
    console.log("close tram")
    changeState(req, res, CLOSED);
}