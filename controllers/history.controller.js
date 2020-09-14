const SellHistory = require('../models/SellHistory.model');

module.exports.addHistory = (req, res) => {
    res.status(200).json({message: 'Done'});
};

module.exports.deleteHistory = (req, res) => {
    res.status(200).json({message: `Deleted History!`});
};

module.exports.findHistories = (req, res) => {
    res.status(200).json({message: 'Here all'});
};

module.exports.findAll = (req, res) => {
    SellHistory.find().then((histories) => {
        res.status(200).json(histories);
    }).catch((err) => {
        res.status(500).json({message: err});
    })
}