var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

// **** Usuari ****
const UserSchema = new Schema({
    username: String,
    email: String,
    password: String,
    permissionLevel: Number,
    tram_num: Number            // enllaça l'usuari amb un tram si (user.tram_num == tram.num)
});

// **** Tram ****
const TramSchema = new Schema({
    // Informació general
    num: {
        type: Number,
        required: true,
        unique: true
    },
    name: String,
    username_coord: String,     // username del usuari coordinador del tram
    avituallament: Boolean,     // el tram té avituallament?
    lat: {
      type: Number,
      required: true
    },
    long: {
      type: Number,
      required: true
    },
    // Ítems
    state: String,              // 3 estats: OPEN, ESCOMBRANT, TANCAT
    material_rebut: Boolean,
    avituallament_rebut: Boolean,
    incidents: [{             // array de incidències
        type: ObjectId,
        ref: 'Incident'
    }]
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
    username: String,

    // Informació sobre l'acció
    date: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    incident_id: ObjectId     // en el cas que es tracti d'una incidència, per identificar-la
})


module.exports.User = mongoose.model('User', UserSchema);
module.exports = mongoose.model('Tram', TramSchema);
module.exports = mongoose.model('Incident', IncidentSchema);
module.exports = mongoose.model('Event', EventSchema);
