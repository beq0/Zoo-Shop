const { ObjectId } = require('bson');
const mongoose = require('mongoose');

const sellHistorySchema = mongoose.Schema({
    productId: {
        type: ObjectId,
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    productType: {
        type: String,
        required: true
    },
    sellDate: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    originalPrice: {
        type: Number,
        required: true
    },
    sellingPrice: {
        type: Number,
        required: true
    },
    benefit: {
        type: Number,
        default: 0
    },
    createDate: {
        type: Date,
        default: new Date()
    }
});

module.exports = mongoose.model('SellHistory', sellHistorySchema);