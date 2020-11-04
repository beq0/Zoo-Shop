const { update } = require('../models/Product.model');
const Product = require('../models/Product.model');

module.exports.addProduct = (req, res) => {
    const prod = new Product({
        code: req.body.code,
        name: req.body.name,
        productType: req.body.productType,
        originalPrice: req.body.originalPrice,
        sellingPrice: req.body.sellingPrice,
        quantity: req.body.quantity,
        quantityType: req.body.quantityType,
        lastChangeDate: new Date(),
        createDate: new Date()
    });
    prod.save().then(() => {
        res.status(200).json({message: 'Saved Product!', status: 200, _id: prod._id});
    }).catch((error) => {
        console.log(error);
        res.status(500).json({message: 'Internal Error!', status: 500});
    });
};

module.exports.changeProduct = (req, res) => {
    if (!req.body._id) {
        res.status(500).json({message: 'Id of the Product not provided!'});
        return;
    }
    let updatedProduct = {}
    if (req.body.code) updatedProduct['code'] = req.body.code;
    if (req.body.name) updatedProduct['name'] = req.body.name;
    if (req.body.productType) updatedProduct['productType'] = req.body.productType;
    if (req.body.originalPrice || req.body.originalPrice === 0) updatedProduct['originalPrice'] = req.body.originalPrice;
    if (req.body.sellingPrice || req.body.sellingPrice === 0) updatedProduct['sellingPrice'] = req.body.sellingPrice;
    if (req.body.quantity || req.body.quantity === 0) updatedProduct['quantity'] = req.body.quantity;
    if (req.body.quantityType) updatedProduct['quantityType'] = req.body.quantityType;
    updatedProduct['lastChangeDate'] = new Date();
    console.log(updatedProduct);
    Product.findOneAndUpdate(
        { '_id': req.body._id },
        { $set: updatedProduct },
        (err) => {
            if (err) {
                console.log(err);
                res.status(500).json({message: err, status: 500});
            } else {
                res.status(200).json({message: `Updated Product ${req.body._id}!`, status: 200, _id: req.body._id});
            }
        }
    )
};

module.exports.deleteProduct = (req, res) => {
    Product.findOneAndDelete(
        { '_id': req.params._id },
        (err, doc) => {
            if (err) {
                res.status(500).json({message: err, status: 500});
            } else {
                res.status(200).json({message: `Deleted Product ${req.body._id}!`, status: 200});
            }
        }
    )
};

module.exports.getProduct = (req, res) => {
    res.status(200).json({message: 'Here'});
};

module.exports.findProducts = (req, res) => {
    let productsForQuery = {}
    if (req.body.code) productsForQuery['code'] = new RegExp(req.body.code, "i");
    if (req.body.name) productsForQuery['name'] = new RegExp(req.body.name, "i");
    if (req.body.productType) productsForQuery['productType'] = new RegExp(req.body.productType, "i");

    const startPrice = req.body.startPrice, endPrice = req.body.endPrice;
    if ((startPrice || startPrice === 0) || (endPrice || endPrice === 0)) productsForQuery['sellingPrice'] = {};
    if (startPrice || startPrice === 0) productsForQuery['sellingPrice']['$gte'] = startPrice;
    if (endPrice || endPrice === 0) productsForQuery['sellingPrice']['$lte'] = endPrice;

    const startLastChangeDate = req.body.startLastChangeDate, endLastChangeDate = req.body.endLastChangeDate;
    if (startLastChangeDate || endLastChangeDate) productsForQuery['lastChangeDate'] = {};
    if (startLastChangeDate) productsForQuery['lastChangeDate']['$gte'] = startLastChangeDate;
    if (endLastChangeDate) productsForQuery['lastChangeDate']['$lte'] = endLastChangeDate;
    console.log(productsForQuery);
    Product.find(productsForQuery).sort({lastChangeDate: 'desc'}).then((products) => {
        res.status(200).json(products);
    }).catch((err) => {
        res.status(500).json({message: err});
    })
};

module.exports.findAll = (req, res) => {
    Product.find().sort({lastChangeDate: 'desc'}).then((products) => {
        res.status(200).json(products);
    }).catch((err) => {
        res.status(500).json({message: err});
    })
}