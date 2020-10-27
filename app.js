const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product.model');
const SellHistory = require('./models/SellHistory.model');
const productRoute = require('./routes/product.route');
const historyRoute = require('./routes/sellHistory.route');
const bodyParser = require("body-parser");
const cors = require('cors');

mongoose.connect('mongodb://localhost/zoo_shop', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
}, (error) => {
  if(!error) console.log('Connected to DB!');
  else console.log(error);
});

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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

//Product routes
app.use('/product', productRoute);

//History routes
app.use('/history', historyRoute);

// catch 404 
app.use('/*', (req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});


mongoose.set('useFindAndModify', false);

module.exports = app;