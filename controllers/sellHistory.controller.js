const SellHistory = require('../models/SellHistory.model');

module.exports.addHistory = (req, res) => {
    const sellHistory = new SellHistory({
        productId: req.body.productId,
        productCode: req.body.productCode,
        productName: req.body.productName,
        productType: req.body.productType,
        sellDate: req.body.sellDate,
        amount: req.body.amount,
        originalPrice: req.body.originalPrice,
        sellingPrice: req.body.sellingPrice,
        benefit: ((req.body.sellingPrice || 0) - (req.body.originalPrice || 0)) * req.body.amount
    });
    sellHistory.save().then(() => {
        res.status(200).json({message: `Saved SellHistory of product ${req.body.productId}!`});
    }).catch((error) => {
        res.status(500).json({message: 'Internal Error!'});
    });
};

module.exports.deleteHistory = (req, res) => {
    SellHistory.findOneAndDelete(
        { '_id': req.query.id },
        (err, doc) => {
            if (err) {
                res.status(500).json({message: err});
            } else {
                res.status(200).json({message: `Deleted SellHistory ${req.body.id}!`});
            }
        }
    )
};

module.exports.findHistories = (req, res) => {
    const isPagination = parseInt(req.params.isPagination);
    const page = parseInt(req.params.page);
    const limit = parseInt(req.params.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    let sellHistoryForQuery = {}
    if (req.body.productId) sellHistoryForQuery['productId'] = req.body.productId;
    if (req.body.productName) sellHistoryForQuery['productName'] = new RegExp(req.body.productName, "i");
    if (req.body.productType) sellHistoryForQuery['productType'] = new RegExp(req.body.productType, "i");
    if (req.body.sellDateFrom || req.body.sellDateTo) sellHistoryForQuery['sellDate'] = {}
    if (req.body.sellDateFrom) sellHistoryForQuery['sellDate']['$gte'] = req.body.sellDateFrom;
    if (req.body.sellDateTo) sellHistoryForQuery['sellDate']['$lte'] = req.body.sellDateTo;
    if (req.body.amount || req.body.amount === 0) sellHistoryForQuery['amount'] = req.body.amount;

    if (isPagination) {
        SellHistory.find(sellHistoryForQuery).sort({createDate: 'desc'}).limit(limit).skip(startIndex).exec().then((histories) => {
            res.status(200).json(histories);
        }).catch((err) => {
            res.status(500).json({message: err});
        })
    } else {
        SellHistory.find(sellHistoryForQuery).then((histories) => {
            res.status(200).json(histories);
        }).catch((err) => {
            res.status(500).json({message: err});
        })
    }
    
};

module.exports.findAll = (req, res) => {
    SellHistory.find().then((histories) => {
        res.status(200).json(histories);
    }).catch((err) => {
        res.status(500).json({message: err});
    })
}

module.exports.getCount = (req, res) => {
    let sellHistoryForQuery = {}
    if (req.body.productName) sellHistoryForQuery['productName'] = new RegExp(req.body.productName, "i");
    if (req.body.productType) sellHistoryForQuery['productType'] = new RegExp(req.body.productType, "i");
    if (req.body.sellDateFrom || req.body.sellDateTo) sellHistoryForQuery['sellDate'] = {}
    if (req.body.sellDateFrom) sellHistoryForQuery['sellDate']['$gte'] = req.body.sellDateFrom;
    if (req.body.sellDateTo) sellHistoryForQuery['sellDate']['$lte'] = req.body.sellDateTo;
    SellHistory.countDocuments(sellHistoryForQuery).then((count) => {
        res.status(200).json(count);
    }).catch((err) => {
        res.status(500).json({message: err});
    })
}