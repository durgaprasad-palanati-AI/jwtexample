const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();

var mongo = require('mongodb')
var MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const userdataschema = require('./model/bookuserschema');

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
const books = [
    {
        "author": "Chinua Achebe",
        "country": "Nigeria",
        "language": "English",
        "pages": 209,
        "title": "Things Fall Apart",
        "year": 1959
    },
    {
        "author": "Hans Christian Andersen",
        "country": "Denmark",
        "language": "Danish",
        "pages": 784,
        "title": "Fairy tales",
        "year": 1836
    },
    {
        "author": "Dante Alighieri",
        "country": "Italy",
        "language": "Italian",
        "pages": 928,
        "title": "The Divine Comedy",
        "year": 1315
    },
];
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

app.post('/login',async (req, res)=> {
    
    const { username, password } = req.body;
    const users = await userdataschema.findOne({username:username,password:password});
    /*
    userdataschema.findOne({username:username,password:password},function(err,users){
        if (err)
        res.send(err);
    */
    
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

app.get('/books', authenticateJWT, (req, res) => {

    res.json(books);
});

app.post('/books', authenticateJWT, (req, res) => {
    console.log("req is==",req.user.role)
    const role  = req.user.role;
    

    if (role !== 'admin') {
        return res.sendStatus(403);
    }


    const book = req.body;
    books.push(book);

    res.send('Book added successfully');
});