var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;


const userSchema = new Schema({
    username: String,
    email: String,
    password: String,
    permissionLevel: Number,
    tram_num_id: Number
});


const TramSchema = new Schema({
    num_id: Number,
    name: String,
    state: String
});
  


module.exports.User = mongoose.model('User', userSchema);
module.exports = mongoose.model('Tram', TramSchema);


