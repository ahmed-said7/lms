const express = require('express');
const session = require('express-session');
const crypto= require('crypto');
const uuid = require('uuid').v4;
const mongoStore=require("connect-mongo");
const app = express();
require("dotenv").config();

// Configure session middleware
// app.use(session({
//     secret: 'your_secret_key',
//     resave: false,
//     saveUninitialized: true
// }));
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(session({
  saveUninitialized:true,
  resave:false,
  secret:'some secret',
  cookie : {
    maxAge:2*365*24*60*60*1000
  },
  store : mongoStore.create({
      mongoUrl: process.env.DB_URL,
      ttl:2*365*24*60*60*1000
  })
}));

// Simulated user accounts stored in memory (replace with a real database)
const user = {
    name : "user",
    deviceId:"handasa"
};

// Middleware to check user authentication
function requireLogin(req, res, next) {
    console.log(req.session);
    if (req.session.userId !== user.deviceId ) {
        return res.status(401).send('Unauthorized');
    }
    next();
}

// Endpoint for user authentication
app.get('/login', (req, res) => {
    const code=crypto.randomBytes(4).toString("hex");
    user.deviceId=code;
    // Simulated authentication logic (replace with real authentication
    req.session.userId = code;
    res.send('Login successful'+JSON.stringify(req.session));
});

// Endpoint for subscription
app.get('/subscribe', requireLogin, (req, res) => {
    res.send("Subscription successfully");
});


// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});