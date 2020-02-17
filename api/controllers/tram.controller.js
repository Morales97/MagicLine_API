var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Tram = mongoose.model('Tram'),
    Event = mongoose.model('Event');
const EventController = require('./event.controller')
const config = require('../../common/env.config');
const OPEN = config.tramStates.OPEN;
const ESCOMBRANT = config.tramStates.ESCOMBRANT;
const CLOSED = config.tramStates.CLOSED;

// FUNCIONA
// Insert a new tram
exports.insert = (req, res) => {
    // set permission level
    req.body.state = CLOSED;
    if(!req.body.avituallament){
        req.body.avituallament = false;
    }
    req.body.material_rebut = false;
    req.body.avituallament_rebut = false;

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
    Tram.find({}, function(err, trams) {
    if (err) res.send(err);
        res.json(trams);
    }).sort({num: 1});
};

// FUNCIONA
// Find a tram by num
exports.getByNum = (req, res) => {
    Tram.findOne({num: req.params.tramNum}, function(err, tram){
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
        let tramNum = user.tram_num;
        Tram.findOne({num: tramNum}, function(err, tram){
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
changeState = (req, res, state, desc) => {
    // 1. Trobem el _id a partir del tramNum
    Tram.findOne({num: req.params.tramNum}, '_id', function (err, _id) {
        if (err) res.send(err);
        // 2. Trobem el tram i el modifiquem
        // Motiu: només findById retorna un objecte Tram que permet fer tram.save
        Tram.findById(_id, function (err, tram) {
            if (err) res.send(err);
            tram.state = state;
            EventController.createEvent(tram, req, desc);
            tram.save(function (err, updatedTram) {
                if (err) res.send(err);
                res.send(updatedTram);
            });
        });
    });
}

// FUNCIONA
// Open tram
exports.openTram = (req, res) => {
    console.log("open tram")
    changeState(req, res, OPEN, 'Open tram');
}

exports.pasEscombra = (req, res) => {
    console.log("escombrant tram")
    changeState(req, res, ESCOMBRANT, 'Pas equip escombra')
}

// FUNCIONA
// Close tram
exports.closeTram = (req, res) => {
    console.log("close tram")
    changeState(req, res, CLOSED, 'Close tram');
}

// Avituallament
// body: {tram_num: X, avituallament_rebut: T/F}
exports.changeAvitRebut = (req, res) => {
    // 1. Trobem el _id a partir del tramNum
    Tram.findOne({num: req.body.tram_num}, '_id', function (err, _id) {
        if (err) res.send(err);
        // 2. Trobem el tram i el modifiquem
        // Motiu: només findById retorna un objecte Tram que permet fer tram.save
        Tram.findById(_id, function (err, tram) {
            if (err) res.send(err);
            tram.avituallament_rebut = req.body.avituallament_rebut;
            if(tram.avituallament_rebut == true){
                EventController.createEvent(tram, req, "Avituallament rebut");
            } else {
                EventController.createEvent(tram, req, "Canvia avituallament_rebut a false");
            }

            tram.save(function (err, updatedTram) {
                if (err) res.send(err);
                res.send(updatedTram);
            });
        });
    });
}

// Material
// body: {tram_num: X, material_rebut: T/F}
exports.changeMaterialRebut = (req, res) => {
    // 1. Trobem el _id a partir del tramNum
    Tram.findOne({num: req.body.tram_num}, '_id', function (err, _id) {
        if (err) res.send(err);
        // 2. Trobem el tram i el modifiquem
        // Motiu: només findById retorna un objecte Tram que permet fer tram.save
        Tram.findById(_id, function (err, tram) {
            if (err) res.send(err);
            tram.material_rebut = req.body.material_rebut;
            if(tram.material_rebut == true){
                EventController.createEvent(tram, req, "Material rebut");
            } else {
                EventController.createEvent(tram, req, "Canvia material_rebut a false");
            }
            tram.save(function (err, updatedTram) {
                if (err) res.send(err);
                res.send(updatedTram);
            });
        });
    });
}

// Picnic
// body: {tram_num: X, picnic_rebut: T/F}
exports.changePicnicRebut = (req, res) => {
    // 1. Trobem el _id a partir del tramNum
    Tram.findOne({num: req.body.tram_num}, '_id', function (err, _id) {
        if (err) res.send(err);
        // 2. Trobem el tram i el modifiquem
        // Motiu: només findById retorna un objecte Tram que permet fer tram.save
        Tram.findById(_id, function (err, tram) {
            if (err) res.send(err);
            tram.picnic_rebut = req.body.picnic_rebut;
            if(tram.material_rebut == true){
                EventController.createEvent(tram, req, "Picnic rebut");
            } else {
                EventController.createEvent(tram, req, "Canvia picnic_rebut a false");
            }
            tram.save(function (err, updatedTram) {
                if (err) res.send(err);
                res.send(updatedTram);
            });
        });
    });
}