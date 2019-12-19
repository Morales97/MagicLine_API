var mongoose = require('mongoose'),
    User = mongoose.model('User');
const crypto = require('crypto');

// Valida que els camps 'username' i 'password' existeixin
exports.hasAuthValidFields = (req, res, next) => {
    let errors = [];

    if (req.body) {
        if (!req.body.username) {
            errors.push('Missing username field');
        }
        if (!req.body.password) {
            errors.push('Missing password field');
        }
        // add here more fields for validation

        if (errors.length) {
            return res.status(400).send({errors: errors.join(',')});
        } else {
            return next();
        }
    } else {
        return res.status(400).send({errors: 'Missing email and password fields'});
    }
};

// Comprova que la password és correcta per a l'usuari
exports.isPasswordAndUserMatch = (req, res, next) => {
    User.find({username: req.body.username}, function(err, user){
        if (err) 
            return res.status(404).send({});
        user = user[0]; // user, 1er element de array user[]
        if (!user) return res.status(404).send("User not found");   // return és necessari pq surti de la funció i no salti error després
        let passwordFields = user.password.split('$');
        let salt = passwordFields[0];
        let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
        if (hash === passwordFields[1]) {
            req.body = {
                userId: user._id,
                username: user.username,
                permissionLevel: user.permissionLevel
                // provider: 'email',
            };
            return next();
        } else {
            return res.status(400).send({errors: ['Invalid e-mail or password']});
        }
    })
};

exports.hasValidTramId = (req, res, next) => {
    let userId = req.jwt.userId;
    User.findById(userId, function(err, user){
        if (err) return res.send(err);
        if (!user){
            return res.status(404).send("User not found")
        }
        if (!user.tram_num_id) {
            return res.status(404).send("User does not have a tram assigned")
        }
        return next();
    })
}