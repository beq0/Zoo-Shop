const router = require('express').Router();
const Product = require('../controllers/product.controller');

router.get('/add', Product.addProduct);

router.get('/change', Product.changeProduct);

router.get('/delete', Product.deleteProduct);

router.get('/all', Product.getProducts);

router.get('/one', Product.getProduct);

module.exports = router;