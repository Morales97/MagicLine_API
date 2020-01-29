var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Tram = mongoose.model('Tram'),
    Incident = mongoose.model('Incident'),
    Event = mongoose.model('Event');
const config = require('../../common/env.config');
const LLEU = config.tramStates.LLEU;
const GREU = config.tramStates.GREU;
const MOLT_GREU = config.tramStates.MOLT_GREU;

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