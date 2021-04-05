const { ObjectId } = require('bson');
const mongoose = require('mongoose');

const sellHistorySchema = mongoose.Schema({
    productId: {
        type: ObjectId,
        required: true
    },
    productCode: {
        type: String,
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
        required: true,
        default: new Date()
    },
    amount: {
        type: Number,
        required: true
    },
    quantityType: {
        type: String,
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
    },
    official: {
        type: Boolean,
        default: true
    },
    description: {
        type: String
    },
    isInCash: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('SellHistory', sellHistorySchema);