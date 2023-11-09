// server/app.js
const { createClient } = require('@supabase/supabase-js');
const morgan = require('morgan');
const bodyparser = require("body-parser");

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

// Morgan untuk Logs
app.use(morgan('combined'));

app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());

const supabaseUrl = 'https://urellsamdantjckmgqlf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVyZWxsc2FtZGFudGpja21ncWxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk0NDkyNjUsImV4cCI6MjAxNTAyNTI2NX0.49qiX8c210M4mGvI2jQViXoey3B4-zJs98lOCZijLw4'
const supabase = createClient(supabaseUrl, supabaseKey)

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

app.post('/transaksi', async (req, res) => {
    const {error} = await supabase
        .from('transaksi')
        .insert({
            id_transaksi: "1A2B3c4d",
            id_pengguna: "q321s4",
            tanggal_transaksi: "2023-11-08",
            total: 100000,
            jenis_pembayaran: "cash",
        })
    if (error) {
        console.log(error);
    }
    return;
});

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
app.get('/transaction', async (req, res) => {
    const {data, error} = await supabase
        .from('barang')
        .select()
    res.render('transaction', {
        layout: 'layouts/layout',
        title:'Transaction',
        datas: data,
    });
})

// Recapitulation
app.get('/recapitulation', (req, res) => {
    
})

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
