const { update } = require('../models/Product.model');
const Product = require('../models/Product.model');
const SellHistory = require('../models/SellHistory.model');
const Management = require('../models/Management.model');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const Generators = require('../helper/generators').Generators;

module.exports.addProduct = (req, res) => {
    const prod = new Product({
        code: req.body.code,
        name: req.body.name,
        providerCode: req.body.providerCode,
        providerName: req.body.providerName,
        productType: req.body.productType,
        originalPrice: req.body.quantity[0].originalPrice,
        sellingPrice: req.body.sellingPrice,
        quantity: req.body.quantity,
        quantityType: req.body.quantityType,
        lastChangeDate: new Date(),
        createDate: new Date(),
        official: req.body.official
    });
    prod.save().then(() => {
        res.status(200).json({message: 'Saved Product!', status: 200, _id: prod._id});
    }).catch((error) => {
        console.log(error);
        res.status(500).json({message: 'Internal Error!', status: 500});
    });
};

module.exports.addProducts = (req, res) => {
    fs.readFile(req.file.path, async (err, data) => {
        if(err) return console.log(err);
        
        try {
            const workbook = XLSX.read(data, {type: 'buffer'});
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const max = sheet['!ref'].substring(sheet['!ref'].indexOf(':') + 2);
            const generators = new Generators();
            const columnGenerator = generators.columnGenerator(max)

            let productCodes = new Set();
            let productsAdded = [];
            while(true) {
                let index = columnGenerator.next();
                if(index.done) break;
                let toAdd = {
                    code : sheet['A' + index.value].v,
                    name : sheet['B' + index.value].v,
                    providerCode : sheet['C' + index.value].v,
                    providerName : sheet['D' + index.value].v,
                    productType : sheet['E' + index.value] ? sheet['E' + index.value].v : 'სხვა',
                    sellingPrice : sheet['F' + index.value].v,
                    quantity : [
                        {
                            quantity: sheet['G' + index.value].v,
                            originalPrice : sheet['H' + index.value].v,
                            createDate: new Date()
                        }
                    ],
                    originalPrice : sheet['H' + index.value].v,
                    quantityType : sheet['I' + index.value].v,
                    official : (sheet['J' + index.value].v == 'კი')
                }
                let possibleProduct = await Product.findOne({code: toAdd.code}).exec();
                if(!possibleProduct) {
                    const prod = new Product({
                        ...toAdd,
                        lastChangeDate: new Date(),
                        createDate: new Date(),
                    });
                    const result = await prod.save();
                    productsAdded.push(result);
                    productCodes.add(result.code);
                } 
                else {
                    toAdd = {
                        ...possibleProduct._doc, 
                        sellingPrice: toAdd.sellingPrice, 
                        quantity: [...possibleProduct.quantity, ...toAdd.quantity],
                        lastChangeDate: new Date()
                    };
                    const result = await Product.findByIdAndUpdate({ '_id': toAdd._id }, { $set: toAdd });
                    if(productCodes.has(result.code)) {
                        productsAdded = productsAdded.filter((elem) => {
                            return elem.code == result.code;
                        });
                        productsAdded.push(result);
                    }
                }
            }
            res.status(200).json({message: 'Saved Products!', status: 200, products: productsAdded});    
        } catch (internalError) {
            console.log(internalError);
            res.status(500).json({message: 'Internal Error!', status: 500});
        } finally {
            // delete all files in uploads folder
            fs.readdir('uploads', (e1, files) => {
                if(e1) return console.log(e1);
    
                for (let file of files) {
                    fs.unlink(path.join('uploads', file), (e2) => {
                        if(e2) return console.log(e2);
                    })
                }
            })
        }
    })
}

module.exports.changeProduct = (req, res) => {
    if (!req.body._id) {
        res.status(500).json({message: 'Id of the Product not provided!'});
        return;
    }
    Management.findOne({name: getManagementName(), password: req.body.password})
        .then((management) => {
            if (management) {
                let updatedProduct = {}
                if (req.body.code) updatedProduct['code'] = req.body.code;
                if (req.body.name) updatedProduct['name'] = req.body.name;
                if (req.body.providerCode) updatedProduct['providerCode'] = req.body.providerCode;
                if (req.body.providerName) updatedProduct['providerName'] = req.body.providerName;
                if (req.body.productType) updatedProduct['productType'] = req.body.productType;
                let quantity = req.body.quantity;
                if (quantity && quantity.length !== 0) {
                    quantity.sort((a, b) => a.createDate - b.createDate);
                    updatedProduct['originalPrice'] = quantity[0].originalPrice;
                } 
                if (req.body.sellingPrice || req.body.sellingPrice === 0) updatedProduct['sellingPrice'] = req.body.sellingPrice;
                if (quantity) updatedProduct['quantity'] = quantity;
                if (req.body.quantityType) updatedProduct['quantityType'] = req.body.quantityType;
                if (req.body.official !== null && req.body.official !== undefined) updatedProduct['official'] = req.body.official;
                updatedProduct['lastChangeDate'] = new Date();
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
                );
            } else {
                res.status(500).json({message: `Management not found / Wrong password druing changing Product`});
            }
        }).catch((err) => {
            res.status(500).json({message: `Internal Error! Could not find Management to change Product`});
        })
};

module.exports.deleteProduct = (req, res) => {
    Management.findOne({name: getManagementName(), password: req.params.password})
        .then((management) => {
            if (management) {
                Product.findOneAndDelete(
                    { '_id': req.params._id },
                    (err, doc) => {
                        if (err) {
                            res.status(500).json({message: err, status: 500});
                        } else {
                            res.status(200).json({message: `Deleted Product ${req.body._id}!`, status: 200});
                        }
                    }
                );
            } else {
                res.status(500).json({message: `Management not found / Wrong password druing deleting Product`});
            }
        }).catch((err) => {
            res.status(500).json({message: `Internal Error! Could not find Management to delete Product`});
        })
};

module.exports.getProduct = (req, res) => {
    res.status(200).json({message: 'Here'});
};

module.exports.findProducts = (req, res) => {
    let productsForQuery = {}
    if (req.body.code) productsForQuery['code'] = new RegExp(req.body.code, "i");
    if (req.body.name) productsForQuery['name'] = new RegExp(req.body.name, "i");
    if (req.body.productType && req.body.productType !== 'ყველა') productsForQuery['productType'] = new RegExp(req.body.productType, "i");

    const startPrice = req.body.startPrice, endPrice = req.body.endPrice;
    if ((startPrice || startPrice === 0) || (endPrice || endPrice === 0)) productsForQuery['sellingPrice'] = {};
    if (startPrice || startPrice === 0) productsForQuery['sellingPrice']['$gte'] = startPrice;
    if (endPrice || endPrice === 0) productsForQuery['sellingPrice']['$lte'] = endPrice;

    const startLastChangeDate = req.body.startLastChangeDate, endLastChangeDate = req.body.endLastChangeDate;
    if (startLastChangeDate || endLastChangeDate) productsForQuery['lastChangeDate'] = {};
    if (startLastChangeDate) productsForQuery['lastChangeDate']['$gte'] = startLastChangeDate;
    if (endLastChangeDate) productsForQuery['lastChangeDate']['$lte'] = endLastChangeDate;

    if (req.body.official !== null && req.body.official !== undefined) productsForQuery['official'] = req.body.official;
    Product.find(productsForQuery).sort({lastChangeDate: 'desc'}).then((products) => {
        products.forEach(product => product.quantity.sort((a, b) => a.createDate - b.createDate));
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

module.exports.sellProduct = async (req, res) => {
    let _id = req.body._id;
    let amount = req.body.amount;
    let sellingPrice = req.body.sellingPrice;
    let sellDate = req.body.sellDate;
    if (!_id) {
        res.status(500).json({message: 'Id of the Product not provided!'});
        return;
    }
    if (!amount) {
        res.status(500).json({message: `Amount to sell Product ${req.body._id} not provided!`});
        return;
    }
    if (!(sellingPrice || sellingPrice === 0)) {
        res.status(500).json({message: `Selling price to sell Product ${req.body._id} not provided!`});
        return;
    }
    product = await getSingleProduct(_id);

    product.quantity.sort((a, b) => a.createDate - b.createDate);
    fullOriginalPrice = 0;
    const startingOriginalPrice = product.quantity[0].originalPrice;
    const fullAmountSold = amount;
    while (amount != 0) {
        let currOriginalPriceInfo = product.quantity[0];
        let currQuantity = currOriginalPriceInfo.quantity;
        let currOriginalPrice = currOriginalPriceInfo.originalPrice;
        if (amount > currQuantity) {
            fullOriginalPrice += currOriginalPrice * currQuantity;
            product.quantity.shift();
            amount -= currQuantity;
        } else {
            currQuantity -= amount;
            fullOriginalPrice += currOriginalPrice * amount;
            if (currQuantity === 0) {
                product.quantity.shift(); 
            } else {
                product.quantity[0].quantity = currQuantity;
            }
            amount = 0;
        }
    }

    if (product.quantity.length !== 0) product.originalPrice = product.quantity[0].originalPrice;
    else product.originalPrice = null
    benefit = (sellingPrice * fullAmountSold) - fullOriginalPrice;

    try {
        addSellHistory(product, fullAmountSold, startingOriginalPrice, sellingPrice, sellDate, benefit, 
            req.body.description, req.body.isInCash);
    } catch (e) {
        res.status(500).json({message: `Error occurred during adding sell history for product ${_id}`, status: 500});
        return;
    }

    console.log(`Added Sell history for [ProductId: ${_id}, SellingPrice: ${sellingPrice}, SellDate: ${sellDate}]`);

    let soldProduct = {
        quantity: product.quantity,
        originalPrice: product.originalPrice
    }
    soldProduct['lastChangeDate'] = new Date();
    Product.findOneAndUpdate(
        { '_id': req.body._id },
        { $set: soldProduct },
        (err) => {
            if (err) {
                console.log(err);
                res.status(500).json({message: `Error occurred during selling a product ${_id}: ` + err, status: 500});
            } else {
                res.status(200).json({message: `Sold ${amount} of Product ${req.body._id}!`, status: 200, _id: req.body._id, 
                                        newQuantity: product.quantity, newOriginalPrice: product.originalPrice});
            }
        }
    )
};

function addSellHistory(product, amountSold, originalPrice, sellingPrice, sellDate, benefit, description, isInCash) {
    const sellHistory = new SellHistory({
        productId: product._id,
        productCode: product.code,
        productName: product.name,
        productType: product.productType,
        sellDate: sellDate || new Date(),
        amount: amountSold,
        quantityType: product.quantityType,
        originalPrice: originalPrice,
        sellingPrice: sellingPrice,
        official: product.official,
        benefit: benefit,
        description,
        isInCash,
        createDate: new Date()
    });
    sellHistory.save().then(() => {
        
    }).catch((error) => {
        throw error;
    });
}

async function getSingleProduct(productId) {
    let product = await Product.findOne({_id: productId}).exec();
    return product;
}

function getManagementName() {
    return 'Management';
}