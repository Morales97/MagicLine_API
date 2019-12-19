
var mongoose = require('mongoose'),
    User = mongoose.model('User');
const crypto = require('crypto');

// FUNCIONA
// Insert a new user
exports.insert = (req, res) => {

    // encrypt password
    let salt = crypto.randomBytes(16).toString('base64');
    let hash = crypto.createHmac('sha512',salt)
                                     .update(req.body.password)
                                     .digest("base64");
    req.body.password = salt + "$" + hash;

    // set permission level
    req.body.permissionLevel = 1;

    // save user
    var new_user = new User(req.body);
    new_user.save(function(err, user){
        if (err) res.send(err);
        res.send({id: user._id});
    });
 };

// FUNCIONA
// Get list of all users ordered by tram_num_id
exports.getAll = (req, res) => {
    User.find({}, {_id: 0, username: 1, tram_num_id: 1, permissionLevel: 1 }, function(err, users) {
    if (err) res.send(err);
        res.json(users);
    }).sort({tram_num_id: 1});
};

// FUNCIONA
// Find a user by ID
exports.getById = (req, res) => {
    User.findById(req.params.userId, function(err, user){
        if (err) res.send(err);
        user = user.toJSON();
        delete user._id;
        delete user.__v;
        res.send(user);
    });
}

// FUNCIONA
// Delete user 
exports.deleteById = (req, res) => {
    User.deleteOne({_id: req.params.userId}, function(err, result){
        if (err) res.send(err);
        res.status(204).send({});   // send status 204 to indicate successfull
    });
}

// FUNCIONA
// Patch user  
exports.patchUser = (req, res) => {
    // encrypt password
    let salt = crypto.randomBytes(16).toString('base64');
    let hash = crypto.createHmac('sha512',salt)
                                     .update(req.body.password)
                                     .digest("base64");
    req.body.password = salt + "$" + hash;

    // patch user
    User.findById(req.params.userId, function (err, user) {
        if (err) res.send(err);
        for (let i in req.body){
            user[i] = req.body[i];
        }
        user.save(function (err, updatedUser) {
            if (err) res.send(err);
            res.send(updatedUser);
        });
    });
}

// FUNCIONA
// Patch only user permission
exports.patchUserPermission = (req, res) => {
    User.findById(req.params.userId, function (err, user) {
        if (err) res.send(err);
        user.permissionLevel = req.body.permissionLevel;
        user.save(function (err, updatedUser) {
            if (err) res.send(err);
            res.send(updatedUser);
        });
    });
}
