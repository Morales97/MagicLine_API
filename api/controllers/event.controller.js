var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Event = mongoose.model('Event');
const { spawn } = require('child_process');
const cmd = spawn("mongo < /opt/mongo_reset.js");

exports.getAll = (req, res) => {
    Event.find({}, function(events, err){
        if(err) res.send(err);
        res.send(events)
    }).sort({date: -1})
}

// Crea un nou event que registra l'acció
exports.createEvent = (tram, req, desc) => {

    let userId = req.jwt.userId

    var new_event = new Event({
        tram_id: tram._id,
        tram_num: tram.num,
        user_id: userId,
        date: Date(),
        description: desc
    });

    User.findById(userId, function(err, user) {
        if (!err) new_event.username = user.username;
        new_event.save();
    })
    console.log(new_event)
    return;
}

exports.createEventIncident = (tram_id, tram_num, incident_id, req, desc) => {

    let userId = req.jwt.userId

    var new_event = new Event({
        tram_id: tram_id,
        tram_num: tram_num,
        user_id: userId,
        date: Date(),
        description: desc,
        incident_id: incident_id
    });

    User.findById(userId, function(err, user) {
        if (!err) new_event.username = user.username;
        new_event.save();
    })
    return;
}

exports.eraseAllData = (req, res) => {

    cmd.stdout.on("data", data => {
        console.log(`stdout: ${data}`);
    });
    
    cmd.stderr.on("data", data => {
        console.log(`stderr: ${data}`);
    });
}