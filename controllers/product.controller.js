const Product = require('../models/Product.model');
const { Mongoose } = require('mongoose');
const { response } = require('../app');

module.exports.addProduct = (req, res) => {
    const prod = new Product({
        name: req.body.name,
        originalPrice: req.body.originalPrice,
        sellingPrice: req.body.sellingPrice,
        quantity: req.body.quantity,
        type: req.body.type
    });
    prod.save().then(() => {
        res.status(200).json({message: 'Saved Product!'});
    }).catch(() => {
        res.status(500).json({message: 'Internal Error!'});
    });
};

module.exports.changeProduct = (req, res) => {
    if (!req.body.id) {
        res.status(500).json({message: 'Id of the Product not provided!'});
        return;
    }
    let updatedProduct = {}
    if (req.body.name) updatedProduct['name'] = req.body.name;
    if (req.body.originalPrice) updatedProduct['originalPrice'] = req.body.originalPrice;
    if (req.body.sellingPrice) updatedProduct['sellingPrice'] = req.body.sellingPrice;
    if (req.body.quantity) updatedProduct['quantity'] = req.body.quantity;
    if (req.body.type) updatedProduct['type'] = req.body.type;
    Product.findOneAndUpdate(
        { '_id': req.body.id },
        { $set: updatedProduct },
        (err, doc) => {
            if (err) {
                res.status(500).json({message: err});
            } else {
                res.status(200).json({message: `Updated Product ${req.body.id}!`});
            }
        }
    )
};

module.exports.deleteProduct = (req, res) => {
    Product.findOneAndDelete(
        { '_id': req.query.id },
        (err, doc) => {
            if (err) {
                res.status(500).json({message: err});
            } else {
                res.status(200).json({message: `Deleted Product ${req.body.id}!`});
            }
        }
    )
};

module.exports.getProduct = (req, res) => {
    res.status(200).json({message: 'Here'});
};

module.exports.findProducts = (req, res) => {
    res.status(200).json({message: 'Here all'});
};

module.exports.findAll = (req, res) => {
    Product.find().then((products) => {
        res.status(200).json(products);
    }).catch((err) => {
        res.status(500).json({message: err});
    })
}