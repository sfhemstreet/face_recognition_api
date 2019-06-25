const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register.js');
const signin = require('./controllers/signin.js');
const image = require('./controllers/image.js');
const profile = require('./controllers/profile.js');

const db = knex({
    client: 'pg',
    connection: {
        // aka local host 
        connectionString: process.env.DATABASE_URL,
        ssl: true,
    }
});
/*
db.select('*').from('users').then(data => {
    console.log(data);
});
*/
const app = express();

// middleware
app.use(bodyParser.json());
app.use(cors());

// ROOT
app.get('/', (req,res) => {
    res.send('Working');
});

// SIGN IN 
// two ways of doing the function call this way is a little more confusing to me
app.post('/signin', signin.handleSignin(db,bcrypt));

// REGISTER
app.post('/register', (req,res) => {register.handleRegister(req,res,db,bcrypt)});

// PROFILE
app.get('/profile/:id', (req,res) => { profile.handleProfileGet(req,res,db) });

// IMAGE 
app.put('/image', (req,res) => { image.handleImage(req,res, db) });
app.post('/imageurl', (req,res) => { image.handleApiCall(req,res) });

// RUN SERVER ON PORT 3000

app.listen(process.env.PORT || 3000, () => {
    console.log(`App running on port ${process.env.PORT}`);
});




