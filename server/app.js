// server/app.js
const { createClient } = require('@supabase/supabase-js');
const morgan = require('morgan');
const bodyparser = require("body-parser");

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const flash = require('connect-flash');
const axios = require("axios");
const randomstring = require("randomstring");
const generateUniqueID = require('../utility/utility'); 

//file upload
const multer = require("multer");
const path = require('path');
const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null,'./public/image')
    },
    filename: (req,file,cb) => {
        console.log(file)
        const fileedit = file.originalname.replace(/ /g,"_");
        cb(null, `${req.body.jenis_barang}_${fileedit}`) 
    }
})

const upload = multer({storage : storage})
//
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

// Login
app.get('/login', (req, res) => {
    res.render('index', { error: null });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const { data, error } = await supabase
            .from('account')
            .select('nama, role')
            .eq('username', username)
            .eq('password', password)
            .single();
        if (error || !data) {
            return res.render('index', { error: 'Invalid username or password' });
        }
        req.session.user = data
        req.session.cart = [];
        res.redirect('/home'); 
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/signout', (req, res) => {
    req.session.destroy
    res.redirect('/');
})


// Home (Home Page)
app.get('/home', (req, res) => {
    if(req.session.user){
        res.render('home', {
            layout: 'layouts/layout',
            title:'Home',
            user: req.session.user,
        });
    }
    else {
        res.render('unauthorized', {
            layout: 'layouts/layout',
            title:'401 Unauthorized',
            messages: 'Silakan <a href="/">login</a> terlebih dahulu.'
        });
    }
})

// Account Management
app.get('/account-management',async (req, res) => {
    if (req.session.user){
        if (req.session.user.role == 'Admin'){
            const {data, error} = await supabase
                .from('account')
                .select()
                res.render('accountManagement', {
                    layout: 'layouts/layout',
                    title:'Account Management',
                    datas: data,
                    user: req.session.user,
                });
        }
        else {
            res.render('unauthorized', {
                layout: 'layouts/layout',
                title:'401 Unauthorized',
                messages: 'Silakan <a href="/">login</a> sebagai Admin terlebih dahulu.'
            });
        }
    }
    else {
        res.render('unauthorized', {
            layout: 'layouts/layout',
            title:'401 Unauthorized',
            messages: 'Silakan <a href="/">login</a> sebagai Admin terlebih dahulu.'
        });
    }
})

app.post('/remove-from-account', async (req, res) => {
    i = -1;
    console.log(req.body.id_pengguna)
    const { data, error } = await supabase
      .from('account') 
      .delete()
      .eq('id_pengguna', req.body.id_pengguna);

    res.redirect('/account-management');
});

app.post('/edit-from-account-management', async (req, res) => {
    const { id_pengguna,username,nama,email,password,role } = req.body;

    if(id_pengguna!==''){
        const { data, error } = await supabase
        .from('account')
        .update({
            id_pengguna,
            username,
            password,
            nama,
            email,
            role
        })
        .eq('id_pengguna', id_pengguna);
    }
    else{
        const { data, error } = await supabase
        .from('account')
        .upsert([
            {
            id_pengguna:generateUniqueID(),
            username,
            password,
            nama,
            email,
            role
            },
        ]);
    }

    res.redirect('/account-management');
});

// Inventory
app.get('/inventory', async (req, res) => {
    if (req.session.user){
        const {data, error} = await supabase
            .from('barang')
            .select()
        res.render('inventory', {
            layout: 'layouts/layout',
            title:'Inventory',
            datas: data,
            user: req.session.user,
        });
    }
    else {
        res.render('unauthorized', {
            layout: 'layouts/layout',
            title:'401 Unauthorized',
            messages: 'Silakan <a href="/">login</a> terlebih dahulu.'
        });
    }
})    

app.post('/remove-from-inventory', async (req, res) => {
    const { data, error } = await supabase
      .from('barang') 
      .delete()
      .eq('id_barang', req.body.id_barang);

    res.redirect('/inventory');
});

app.post('/remove-from-transaksi', async (req, res) => {
    const { data, error } = await supabase
      .from('transaksi') 
      .delete()
      .eq('id_transaksi', req.body.id_transaksi);

    res.redirect('/recapitulation');
});

app.post('/edit-from-inventory', upload.single("image") ,async (req, res) => {
    const { id_barang, jenis_barang, stock, harga,deskripsi } = req.body;
    if(id_barang!==''){
        const { data, error } = await supabase
        .from('barang')
        .update({
            jenis_barang,
            stock,
            harga,
        })
        .eq('id_barang', id_barang);
    }
    else{
        var fileedit = req.file.originalname.replace(/ /g,"_");
        const { data, error } = await supabase
        .from('barang')
        .upsert([
            {
            id_barang:generateUniqueID(),
            jenis_barang,
            stock,
            harga, 
            deskripsi,
            image_name: `${req.body.jenis_barang}_${fileedit}`,
            },
        ]);
    }

    res.redirect('/inventory');
});


// Transaction
app.get('/transaction', async (req, res) => {
    if (req.session.user){
        if (req.session.user.role == 'Admin' || req.session.user.role == 'Kasir'){
            req.session.total = 0
            req.session.cart.forEach(item => {
                req.session.total += item.jumlah * item.harga;
            })
            const {data, error} = await supabase
                .from('barang')
                .select()
            res.render('transaction', {
                layout: 'layouts/layout',
                title:'Transaction',
                datas: data,
                cart: req.session.cart,
                total: req.session.total,
                editjumlahmsg: req.flash('edit-jumlah-msg'),
                user: req.session.user,
            });
        }
        else {
            res.render('unauthorized', {
                layout: 'layouts/layout',
                title:'401 Unauthorized',
                messages: 'Silakan <a href="/">login</a> sebagai Admin / Kasir terlebih dahulu.'
            });
        }
    }
    else {
        res.render('unauthorized', {
            layout: 'layouts/layout',
            title:'401 Unauthorized',
            messages: 'Silakan <a href="/">login</a> sebagai Admin / Kasir terlebih dahulu.'
        });
    }
})

app.post('/add-to-cart', async (req, res) => {
    req.session.cart.push({
        id_barang: req.body.id_barang,
        jenis_barang: req.body.jenis_barang,
        harga: parseInt(req.body.harga),
        jumlah: 1
    });
    res.redirect('/transaction');
});

app.post('/edit-jumlah', async (req, res) => {
    checkStock = false;
    const { data, error } = await supabase
        .from('barang')
        .select('id_barang, stock')
        .eq('id_barang', req.body.id_barang);
    req.session.cart.forEach(item => {
        if (item.id_barang == req.body.id_barang){
            if (data[0].stock >= parseInt(req.body.jumlah)){
                checkStock = true;
                item.jumlah = parseInt(req.body.jumlah);
            }
        }
    })
    if (checkStock == false){
        req.flash('edit-jumlah-msg', 'Jumlah tidak boleh melebihi stock');
    }
    res.redirect('/transaction');
});

app.post('/remove-from-cart', async (req, res) => {
    i = -1;
    req.session.cart.forEach(item => {
        i += 1;
        if (item.id_barang == req.body.id_barang){
            req.session.cart.splice(i,1);
        }
    })
    res.redirect('/transaction');
});

app.post('/reset-cart', async (req, res) => {
    req.session.cart = [];
    res.redirect('/transaction');
});

app.post('/pay', async (req, res) => {
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();

    timestamp = `${Date.now()}`;
    random = randomstring.generate(5);

    id_transaksi = `${timestamp}${random}`;

    const {error} = await supabase
        .from('transaksi')
        .insert({
            id_transaksi: `${id_transaksi}`,
            id_pengguna: "q321s4",
            tanggal_transaksi: `${year}-${month}-${date}`,
            total: req.session.total,
            jenis_pembayaran: req.body.jenisPembayaran,
        })
    if (error) {
        console.log(error);
    }

    async function insertToTransaksi(item) {
        const { error } = await supabase
            .from('transaction_detail')
            .insert({
                id_transaksi: `${id_transaksi}`,
                id_barang: item.id_barang,
                jumlah: item.jumlah,
            });
    
        if (error) {
            console.log(error);
        }
    }

    const cartItems = req.session.cart;
    
    for (const item of cartItems) {
        await insertToTransaksi(item);
    }
    
    async function updateStock(item, barang) {
        const newStock = parseInt(barang.stock) - parseInt(item.jumlah);
        console.log(typeof newStock);
        console.log(newStock)
        console.log(barang.stock)
        console.log(item.jumlah)
        const { error } = await supabase
            .from('barang')
            .update({
                stock: parseInt(newStock),
            })
            .eq('id_barang', item.id_barang)
        if (error) {
            console.log(error);
        }
    }

    for (const item of cartItems) {
        const { data, error1 } = await supabase
            .from('barang')
            .select('id_barang, stock')
            .eq('id_barang', item.id_barang);
        await updateStock(item,data[0]);
    }

    req.session.cart = [];
    res.redirect('/transaction');
});

app.get('/recapitulation', async (req, res) => {
    if (req.session.user){
        if (req.session.user.role == 'Admin'){
            try {
                const { data: transactions, error } = await supabase
                    .from('transaksi')
                    .select()
                
                if (error) {
                    console.error(error);
                    return res.status(500).send('Internal Server Error');
                }
        
                // Calculate total sales
                const totalSales = transactions.reduce((total, transaction) => total + transaction.total, 0);
        
                // Render the recapitulation page with transaction data and total sales
                res.render('recapitulation', {
                    layout: 'layouts/layout',
                    title: 'Recapitulation',
                    transactions: transactions,
                    totalSales: totalSales,
                    user: req.session.user,
                });
            } catch (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
            }
        }
        else {
            res.render('unauthorized', {
                layout: 'layouts/layout',
                title:'401 Unauthorized',
                messages: 'Silakan <a href="/">login</a> sebagai Admin terlebih dahulu.'
            });
        }
    }
    else {
        res.render('unauthorized', {
            layout: 'layouts/layout',
            title:'401 Unauthorized',
            messages: 'Silakan <a href="/">login</a> sebagai Admin terlebih dahulu.'
        });
    }
})


app.get('/transaction-details/:id', async (req, res) => {
    if (req.session.user){
        if (req.session.user.role == 'Admin'){
            const { id } = req.params;
            console.log("Fetching details for transaction ID:", id); // Debugging line

            try {
                const { data, error } = await supabase
                    .from('transaction_detail')
                    .select(`
                        id_barang,
                        jumlah,
                        barang (
                            jenis_barang,
                            harga
                        )
                    `)
                    .eq('id_transaksi', id);

                if (error) {
                    console.error('Error fetching transaction details:', error);
                    res.status(500).json({ message: 'Internal Server Error', error });
                } else {
                    console.log("Transaction details data:", data); // Debugging line
                    res.json(data);
                }
            } catch (error) {
                console.error('Server error:', error);
                res.status(500).json({ message: 'Internal Server Error', error });
            }
        }
        else {
            res.render('unauthorized', {
                layout: 'layouts/layout',
                title:'401 Unauthorized',
                messages: 'Silakan <a href="/">login</a> sebagai Admin terlebih dahulu.'
            });
        }
    }
    else {
        res.render('unauthorized', {
            layout: 'layouts/layout',
            title:'401 Unauthorized',
            messages: 'Silakan <a href="/">login</a> sebagai Admin terlebih dahulu.'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
