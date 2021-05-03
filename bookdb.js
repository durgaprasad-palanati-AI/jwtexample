const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();

var mongo = require('mongodb')
var MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
userdata = require('.model/userdatashema');

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

//var dbo = db.db("user");
var usersd = db.collection("bookuser").find();



const books = [
    {
        "author": "Chinua Achebe",
        "country": "Nigeria",
        "language": "English",
        "pages": 209,
        "title": "Things Fall Apart",
        "year": 1958
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

app.post('/login', (req, res) => {
    // Read username and password from request body
    const { username, password } = req.body;

    // Filter user from the users array by username and password
    const user = users.find(u => { return u.username === username && u.password === password });

    if (user) {
        // Generate an access token
        const accessToken = jwt.sign({ username: user.username,  role: user.role }, accessTokenSecret);

        res.json({
            accessToken
        });
    } else {
        res.send('Username or password incorrect');
    }
});

app.get('/books', authenticateJWT, (req, res) => {
    res.json(books);
});

app.post('/books', authenticateJWT, (req, res) => {
    const { role } = req.user;

    if (role !== 'admin') {
        return res.sendStatus(403);
    }


    const book = req.body;
    books.push(book);

    res.send('Book added successfully');
});