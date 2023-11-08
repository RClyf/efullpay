// server/app.js
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const flash = require('connect-flash');
const axios = require("axios");

const PORT = process.env.PORT || 8080;

const app = express();

//Gunakan ejs
app.set('view engine', 'ejs');

// Third party middleware
app.use(expressLayouts);

//Built-in middleware
app.use(express.static('public'));
app.use('/node_modules',express.static('node_modules'));
app.use(express.urlencoded({ extended: true}));

//Konfigurasi flash
const duration=30*24*60*60*1000;
app.use(session({
    secret: 'secret',
    resave: true, 
    saveUninitialized: true,
    cookie: {maxAge: duration, sameSite: 'strict'}
}))
app.use(flash());

// Index (Landing Page)
app.get('/', (req, res) => {
    res.render('index', {
        layout: 'layouts/index', 
        title:'Index',
    });
})

// Home (Home Page)
app.get('/home', (req, res) => {
    res.render('home', {
        layout: 'layouts/layout',
        title:'Home',
    });
})

// Login
app.get('/login', (req, res) => {
    
})

// Home (Home Page)
app.get('/home', (req, res) => {
    res.render('home', {
        layout: 'layouts/layout',
        title:'Home',
    });
})

// Account Management
app.get('/account-management', (req, res) => {
    
})

// Inventory
app.get('/inventory', (req, res) => {
    
})    

// Transaction
app.get('/transaction', (req, res) => {
    
})

// Recapitulation
app.get('/recapitulation', (req, res) => {
    
})

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
