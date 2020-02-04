var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

<<<<<<< HEAD

const userSchema = new Schema({
=======
// **** Usuari ****
const UserSchema = new Schema({
>>>>>>> bfe357c8f676c8847a60316000f6aa4b21937f7a
    username: String,
    email: String,
    password: String,
    permissionLevel: Number,
    tram_num: Number            // enllaça l'usuari amb un tram si (user.tram_num == tram.num)
});

// **** Tram ****
const TramSchema = new Schema({
<<<<<<< HEAD
    num: {
=======
    // Informació general
    num: { 
>>>>>>> bfe357c8f676c8847a60316000f6aa4b21937f7a
        type: Number,
        required: true,
        unique: true
    },
    name: String,
<<<<<<< HEAD
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
=======
    username_coord: String,     // username del usuari coordinador del tram
    avituallament: Boolean,     // el tram té avituallament?

    // Ítems
    state: String,              // 3 estats: OPEN, ESCOMBRANT, TANCAT
    material_rebut: Boolean,
    avituallament_rebut: Boolean,
    incidents: [{             // array de incidències
        type: ObjectId,
        ref: 'Incident'
    }]
>>>>>>> bfe357c8f676c8847a60316000f6aa4b21937f7a
});

// **** Incidènica ****: Un problema que reporta el coordinador de tram
const IncidentSchema = new Schema({
    // Tram
    tram_id: ObjectId,
    tram_num: {
        type: Number,
        required: true
    },
    creator: String,           // Usuari que crea la indicènica

    // Informació de la incidència
    description: String,
    comments: [{                // array de comentaris
        username: String,       // usuari que fa el comentari (coordi_X o admin)
        comment: String,         // comentari
        date: Date
    }],
    category: String,           // 3 categories: LLEU, GREU, MOLT GREU
    solved: Boolean,
})

// **** Event ****: Qualsevol acció que faci un coordinador o administrador genera un event que ho registra
const EventSchema = new Schema({
<<<<<<< HEAD
    tram_id: {                  // Tram al que fa referència
        type: ObjectId,
        required: true
    },
    user_id: {                  // User que ha realitzat l'acció
        type: ObjectId,
        ref: 'User'
    },
    tram_num: Number,
=======
    // Tram al que fa referència
    tram_id: {                  
        type: ObjectId, 
        required: true
    },    
    tram_num: Number,

    // Usuari que ha realitzat l'acció
    user_id: {                  
        type: ObjectId, 
        ref: 'User'
    },     
>>>>>>> bfe357c8f676c8847a60316000f6aa4b21937f7a
    username: String,

    // Informació sobre l'acció
    date: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
<<<<<<< HEAD
    }
=======
    },
    incident_id: ObjectId     // en el cas que es tracti d'una incidència, per identificar-la
>>>>>>> bfe357c8f676c8847a60316000f6aa4b21937f7a
})


module.exports.User = mongoose.model('User', UserSchema);
module.exports = mongoose.model('Tram', TramSchema);
module.exports = mongoose.model('Incident', IncidentSchema);
module.exports = mongoose.model('Event', EventSchema);
