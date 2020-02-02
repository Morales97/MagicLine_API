var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Tram = mongoose.model('Tram'),
    Incident = mongoose.model('Incident'),
    Event = mongoose.model('Event');
var ObjectId = require('mongodb').ObjectID;
const config = require('../../common/env.config');
const LLEU = config.incidentGravity.LLEU;
const GREU = config.incidentGravity.GREU;
const MOLT_GREU = config.incidentGravity.MOLT_GREU;

// Create a new incident
exports.create = (req, res) => {

    req.body.solved = false;
    if(!req.body.category){
        req.body.category = LLEU;
    }

    console.log(req.body.description)

    Tram.findOne({num: req.body.tram_num}, function (err, tram) {
        if(err) res.send(err);
        req.body.tram_id = tram._id;
        var new_incident = new Incident(req.body);
        new_incident.save(function(err, incident){
            if (err) res.send(err);
            Tram.findByIdAndUpdate(tram._id, {$push: {incidents: incident._id}}, function(err, tram){
                console.log(tram)
            })
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
            res.send(updatedIncident);
        })
    })
 }



// ************* MIDDLEWARE *************

 exports.hasValidIdAndCategory = (req, res, next) => {

    if(req.body.category != LLEU && req.body.category != GREU && req.body.category != MOLT_GREU) {
        return res.status(400).send("Categoria no admesa")
    }

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

    

    //Incident.findById(req.body._id, function(err, incident){
}