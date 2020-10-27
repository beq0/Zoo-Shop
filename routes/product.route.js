const router = require('express').Router();
const Product = require('../controllers/product.controller');

router.post('/add', Product.addProduct);

router.post('/change', Product.changeProduct);

router.delete('/delete/:_id', Product.deleteProduct);

router.get('/findProducts', Product.findProducts);

router.get('/findAll', Product.findAll)

router.get('/one', Product.getProduct);

module.exports = router;