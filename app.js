const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product.model');
const SellHistory = require('./models/SellHistory.model');
const productRoute = require('./routes/product.route');

mongoose.connect('mongodb://localhost/zoo_shop', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
}, (error) => {
  if(!error) console.log('Connected to DB!');
  else console.log(error);
});

// uncomment if virgin

// const product = new Product({
//     name: 'Test Product',
// 	originalPrice: 5,
// 	sellingPrice: 6,
// 	quantity: 15,
// 	type: 'Satesto'
// });

// product.save().then(res => {
//     console.log(res);
// }).catch(err => {
//     console.log(err)
// });

// Product.findOne({name: "Test Product"}).then(res =>{
//     let id = res._id;
//     let sellHistory = new SellHistory({
//         productId: id,
//         sellDate: Date(),
//         amount: 1
//     });
//     sellHistory.save().then(res => console.log(res)).catch(err => console.log(err));
// }).catch(err => console.log(err));

const app = express();

dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Product routes
app.use('/product', productRoute);

app.get('/tmp', async (req, res) => {
    res.status(200).send("Hello world!"); 
});

mongoose.set('useFindAndModify', false);

module.exports = app;