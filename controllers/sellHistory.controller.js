const SellHistory = require('../models/SellHistory.model');
const Management = require('../models/Management.model');

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
        official: req.body.official,
        benefit: ((req.body.sellingPrice || 0) - (req.body.originalPrice || 0)) * req.body.amount,
        description: req.body.description,
        isInCash: req.body.isInCash,
        createDate: new Date()
    });
    sellHistory.save().then(() => {
        res.status(200).json({message: `Saved SellHistory of product ${req.body.productId}!`});
    }).catch((error) => {
        res.status(500).json({message: 'Internal Error!'});
    });
};

module.exports.deleteHistory = (req, res) => {
    Management.findOne({name: getManagementName(), password: req.params.password})
        .then((management) => {
            if (management) {
                SellHistory.findOneAndDelete(
                    { '_id': req.params._id },
                    (err, doc) => {
                        if (err) {
                            res.status(500).json({message: err, status: 500});
                        } else {
                            res.status(200).json({message: `Deleted History ${req.params._id}!`, status: 200});
                        }
                    }
                );
            } else {
                res.status(500).json({message: `Management not found / Wrong password druing deleting History`});
            }
        }).catch((err) => {
            res.status(500).json({message: `Internal Error! Could not find Management to delete History`});
        })
};

module.exports.findHistories = (req, res) => {
    const isPagination = parseInt(req.params.isPagination);
    const page = parseInt(req.params.page);
    const limit = parseInt(req.params.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    let sellHistoryForQuery = {}
    if (req.body.productId) sellHistoryForQuery['productId'] = req.body.productId;
    if (req.body.productCode) sellHistoryForQuery['productCode'] = new RegExp(req.body.productCode, "i");
    if (req.body.productName) sellHistoryForQuery['productName'] = new RegExp(req.body.productName, "i");
    if (req.body.productType && req.body.productType !== 'ყველა') sellHistoryForQuery['productType'] = new RegExp(req.body.productType, "i");

    const benefitFrom = req.body.benefitFrom, benefitTo = req.body.benefitTo;
    if ((benefitFrom || benefitFrom === 0) || (benefitTo || benefitTo === 0)) sellHistoryForQuery['benefit'] = {};
    if (benefitFrom || benefitFrom === 0) sellHistoryForQuery['benefit']['$gte'] = benefitFrom;
    if (benefitTo || benefitTo === 0) sellHistoryForQuery['benefit']['$lte'] = benefitTo;

    const sellDateFrom = req.body.sellDateFrom, sellDateTo = req.body.sellDateTo;
    if (sellDateFrom || sellDateTo) sellHistoryForQuery['sellDate'] = {}
    if (sellDateFrom) sellHistoryForQuery['sellDate']['$gte'] = sellDateFrom;
    if (sellDateTo) sellHistoryForQuery['sellDate']['$lt'] = sellDateTo;

    if (req.body.amount || req.body.amount === 0) sellHistoryForQuery['amount'] = req.body.amount;
    if (req.body.official !== null && req.body.official !== undefined) sellHistoryForQuery['official'] = req.body.official;
    if (isPagination) {
        SellHistory.find(sellHistoryForQuery).sort({createDate: 'desc'}).limit(limit).skip(startIndex).exec().then((histories) => {
            res.status(200).json(histories);
        }).catch((err) => {
            res.status(500).json({message: err});
        })
    } else {
        SellHistory.find(sellHistoryForQuery).sort({createDate: 'desc'}).then((histories) => {
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
    if (req.body.productCode) sellHistoryForQuery['productCode'] = new RegExp(req.body.productCode, "i");
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

function getManagementName() {
    return 'Management';
}