const router = require('express').Router();
const Product = require('../controllers/product.controller');

router.put('/add', Product.addProduct);

router.put('/change', Product.changeProduct);

router.delete('/delete', Product.deleteProduct);

router.get('/findProducts', Product.findProducts);

router.get('/findAll', Product.findAll)

router.get('/one', Product.getProduct);

module.exports = router;