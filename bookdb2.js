const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();

var mongo = require('mongodb')
var MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const userdataschema = require('./model/bookuserschema');
const bookdataschema = require('./model/bookdetailsschema');

var url = "mongodb://localhost:27017/user";

app.use(bodyParser.json());


app.listen(4000, () => {
    console.log('Books service started on port 4000');
});


mongoose.connect(url,{useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;

// Added check for DB connection
if(!db)
    console.log("Error connecting db")
else
    console.log("Db connected successfully to "+db.name)

/* 
app.get('/books', (req, res) => {
    res.json(books);
});
 */
const accessTokenSecret = 'durgabooks123';

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) {
                
                
                return res.sendStatus(403);
            }

            req.user = user;
            
            next();
        });
    } else {
        res.sendStatus(401);
    }
};


app.get('/users', function (req, res) {
    
    userdataschema.find({},function (err, users) {
        
         if (err)
            res.send(err);
        res.json({
            
            message: 'user details loading..',
            data: users
        });
    });
});

app.get('/booksare', function (req, res) {
    
    bookdataschema.find({},function (err, books) {
        
         if (err)
            res.send(err);
        res.json({
            
            message: 'book details loading..',
            data: books
        });
    });
});

app.post('/login',async (req, res)=> {
    
    const { username, password } = req.body;
    const users = await userdataschema.findOne({username:username,password:password});
    
    
    if (users)
    {       
        const accessToken = jwt.sign({ username: users.username,  role: users.role }, accessTokenSecret);

        res.json({
            useris:users.username,
            roleis:users.role,
            accessToken
        });
    } 
    else {
        res.send('Username or password incorrect');
            }
    });

app.get('/getbooks', authenticateJWT, (req, res) => {

    bookdataschema.find({},function (err, books) {
        
        if (err)
           res.send(err);
       res.json({
           
           message: 'book details loading..',
           data: books
       });
   });
});

app.post('/addbook', authenticateJWT, (req, res) => {
    //console.log("req is==",req.user.role)
    const role  = req.user.role;
    

    if (role !== 'admin') {
        return res.sendStatus(403);
    }


    const book = req.body;
    bookdataschema.create(book);

    res.send('Book added successfully');
});