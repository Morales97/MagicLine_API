var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Tram = mongoose.model('Tram'),
    Incident = mongoose.model('Incident'),
    Event = mongoose.model('Event');
const EventController = require('./event.controller')
var ObjectId = require('mongodb').ObjectID;
const config = require('../../common/env.config');
const LLEU = config.incidentGravity.LLEU;
const GREU = config.incidentGravity.GREU;
const MOLT_GREU = config.incidentGravity.MOLT_GREU;

exports.getAll = (req, res) => {

    Incident.find({}, function(incs, err){
        if (err) res.send(err);
        res.send(incs)
    }).sort({tram_num: 1})
}

// Create a new incident
exports.create = (req, res) => {

    User.findById(req.jwt.userId, function(err, user){
        if (err) res.send(err);
        req.body.creator = user.username
    })

    req.body.solved = false;
    if(!req.body.category){
        req.body.category = LLEU;
    }

    Tram.findOne({num: req.body.tram_num}, function (err, tram) {
        if(err) res.send(err);
        req.body.tram_id = tram._id;
        var new_incident = new Incident(req.body);
        new_incident.save(function(err, incident){
            if (err) res.send(err);
            Tram.findByIdAndUpdate(
                tram._id, 
                {$push: {incidents: incident._id}}, 
                function(err, tram){
                    if(err) res.send(err);
                }
            )
            EventController.createEventIncident(incident.tram_id, incident.tram_num, incident._id, req, 
                "Incidència creada")
            res.send(incident);
        });
    });
 };

 // Change category
 exports.changeCategory = (req, res) => {

    Incident.findById(req.body._id, function(err, incident){
        if(err) res.send(err);

        incident.category = req.body.category
        incident.save(function (err, updatedIncident){
            if(err) res.send(err);
            EventController.createEventIncident(incident.tram_id, incident.tram_num, incident._id, req, 
                "Canvi de categoria a " + incident.category)
            res.send(updatedIncident);
        })
    })
 }

 // Change status to Solved
 exports.solveIncident = (req, res) => {

    Incident.findById(req.body._id, function(err, incident){
        if(err) res.send(err);

        incident.solved = true;
        incident.save(function (err, updatedIncident){
            if(err) res.send(err);
            EventController.createEventIncident(incident.tram_id, incident.tram_num, incident._id, req, 
                "Incidència solucionada")
            res.send(updatedIncident);
        })
    })
 }

// Add a comment
exports.commentIncident = (req, res) => {

    User.findById(req.jwt.userId, function(err, user){
        if (err) res.send(err);
        req.body.username = user.username
        Incident.findByIdAndUpdate(
            req.body._id, 
            {$push: {comments: {username: req.body.username, comment: req.body.comment, date: Date()}}},
            function(err, incident){
                if(err) res.send(err);
                EventController.createEventIncident(incident.tram_id, incident.tram_num, incident._id, req, 
                    "Comentari sobre la incidència")
                res.send(incident)
            }
        )
    })
}

// ************* MIDDLEWARE *************

 exports.hasValidId= (req, res, next) => {
    if(req.body._id == null) {
        return res.status(400).send("Falta incident _id")
    }
    if(!ObjectId.isValid(req.body._id)){
        return res.status(400).send("_id not valid")
    }
   
    Incident.countDocuments({_id: req.body._id}, function (err, count){ 
        if(count>0){
            return next();
        }
        return res.status(400).send("No _id match")
    }); 
}

exports.hasValidCategory = (req, res, next) => {
    if(req.body.category != LLEU && req.body.category != GREU && req.body.category != MOLT_GREU) {
        return res.status(400).send("Categoria no admesa")
    }

    return next();
}

