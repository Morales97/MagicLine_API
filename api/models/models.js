var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;


const userSchema = new Schema({
    username: String,
    email: String,
    password: String,
    permissionLevel: Number,
    tram_num: Number         // enllaça l'usuari amb un tram si (user.tram_num == tram.num)
});


const TramSchema = new Schema({
    num: {
        type: Number,
        required: true,
        unique: true
    },
    name: String,
    state: String,
    long:{
      type: Number,
      required: true,
      unique: true
    },
    lat:{
      type: Number,
      required: true,
      unique: true
    }
    /*register: [{          // No cal fer una llista d'ObjectId de entrades al registre, és facil filtrar d'entre totes les entrades les que tinguin tram_num = X
        type: ObjectId,
        ref: 'Event'
    }]*/
});

const EventSchema = new Schema({
    tram_id: {                  // Tram al que fa referència
        type: ObjectId,
        required: true
    },
    user_id: {                  // User que ha realitzat l'acció
        type: ObjectId,
        ref: 'User'
    },
    tram_num: Number,
    username: String,
    date: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    }
})


module.exports.User = mongoose.model('User', userSchema);
module.exports = mongoose.model('Tram', TramSchema);
module.exports = mongoose.model('Event', EventSchema);
