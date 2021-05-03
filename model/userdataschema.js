var mongoose = require('mongoose');// Setup schema
var userschema = mongoose.Schema({
    id:{
        type:String
    },
    username: {
        type: String,
        required: true
    },
    password:{
        type:String
    },
    role:{
        type:String
    }
    
});
// Export user model
var userdataschema = module.exports = mongoose.model('usersdataschema', userschema);
module.exports.get = function (callback, limit) {
    userdata.find(callback).limit(limit);
}