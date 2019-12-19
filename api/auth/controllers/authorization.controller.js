const jwtSecret = require('../../../common/env.config.js').jwt_secret,
    jwt = require('jsonwebtoken');
const crypto = require('crypto');
var mongoose = require('mongoose'),
    User = mongoose.model('User');
const config = require('../../../common/env.config');
const ADMIN = config.permissionLevels.ADMIN;

// Fa login i retorna accessToken i refreshToken
exports.login = (req, res) => {
    try {
        console.log(req.body.userId)
        let refreshId = req.body.userId + jwtSecret;
        let salt = crypto.randomBytes(16).toString('base64');
        let hash = crypto.createHmac('sha512', salt).update(refreshId).digest("base64");
        req.body.refreshKey = salt;
        let token = jwt.sign(req.body, jwtSecret);
        let b = Buffer.from(hash);
        let refresh_token = b.toString('base64');
        let isAdmin = false;
        User.findById(req.body.userId, 'permissionLevel', function(err, user){
            if (err) res.send(err);
            if (user.permissionLevel === ADMIN) {
                isAdmin = true;
            }
            res.status(201).send({
                username: req.body.username, 
                accessToken: token, 
                refreshToken: refresh_token, 
                isAdmin: isAdmin
            });
        })
    } catch (err) {
        res.status(500).send({errors: err});
    }
};

// Actualitza token i el retorna el nou 
exports.refresh_token = (req, res) => {
    try {
        req.body = req.jwt;
        let token = jwt.sign(req.body, jwtSecret);
        res.status(201).send({id: token});
    } catch (err) {
        res.status(500).send({errors: err});
    }
};