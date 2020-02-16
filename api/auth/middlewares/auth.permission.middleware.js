const config = require('../../../common/env.config');
const ADMIN_PERMISSION = config.permissionLevels.ADMIN;
var mongoose = require('mongoose'),
    User = mongoose.model('User');

// Comprova que té permís
exports.minimumPermissionLevelRequired = (required_permission_level) => {
    return (req, res, next) => {
        let user_permission_level = parseInt(req.jwt.permissionLevel);
        let userId = req.jwt.userId;
        if (user_permission_level >= required_permission_level) {    
            return next();
        } else {
            return res.status(403).send("Not allowed");
        }
    };
};

// Comprova si es admin/el mateix usuari
exports.onlySameUserOrAdminCanDoThisAction = (req, res, next) => {

    let user_permission_level = parseInt(req.jwt.permissionLevel);
    let userId = req.jwt.userId;
    if (req.params && req.params.userId && userId === req.params.userId) {
        return next();
    } else {
        if (user_permission_level == ADMIN_PERMISSION) {
            return next();
        } else {
            return res.status(403).send("Only admin or same user");
        }
    }

};

// Comprova que no sigui el mateix usuari
exports.sameUserCantDoThisAction = (req, res, next) => {
    let userId = req.jwt.userId;

    if (req.params.userId !== userId) {
        return next();
    } else {
        return res.status(400).send();
    }

};

// Comrpova que l'usuari siqui el owner del tram, o be l'admin
exports.onlyOwnerOfTramOrAdmin = (req, res, next) => {
    let user_permission_level = parseInt(req.jwt.permissionLevel);
    if (user_permission_level == ADMIN_PERMISSION) {
        return next();
    } 
    
    let userId = req.jwt.userId;

    User.findById(userId, function(err, user){
        if (err) return res.status(403).send("Not allowed");
        if(!user.tram_num) return res.status(403).send("No tram assigned");

        if(req.body.tram_num){
            if(req.body.tram_num == user.tram_num){
                return next();
            } else {
                return res.status(403).send("Only admin or tram owner");
            }
        }

        var tram_typed = (+req.params.tramNum);
        if(req.params && req.params.tramNum && user.tram_num === tram_typed){
            return next();
        } else {
            return res.status(403).send("Only admin or tram owner");
        }
    })

}