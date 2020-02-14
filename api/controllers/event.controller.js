var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Event = mongoose.model('Event');


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