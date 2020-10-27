const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    productType: {
        type: String
    },
    originalPrice: {
        type: Number,
        required: true
    },
    sellingPrice: {
        type: Number,
        default: 0
    },
    quantity: {
        type: Number,
        default: 0
    },
    quantityType: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Product', productSchema);