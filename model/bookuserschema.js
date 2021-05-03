var mongoose = require('mongoose');// Setup schema
var userschema = mongoose.Schema({

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
var bookuser = module.exports = mongoose.model('bookuser', userschema,'bookuser');
module.exports.get = function (callback, limit) {
    bookuser.find(callback).limit(limit);
}