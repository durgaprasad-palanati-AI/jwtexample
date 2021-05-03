var mongoose = require('mongoose');// Setup schema
var bookschema = mongoose.Schema({

    author: {
        type: String,
        
    },
    country:{
        type:String
    },
    language:{
        type:String
    },
    pages: {
        type: Number,
        
    },
    title:{
        type:String
    },
    year:{
        type:Number
    }
    
});
// Export user model
var books = module.exports = mongoose.model('books', bookschema,'books');
module.exports.get = function (callback, limit) {
    books.find(callback).limit(limit);
}