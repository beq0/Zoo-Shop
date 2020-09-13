const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    originalPrice: {
        type: Number,
        required: true
    },
    sellingPrice: {
        type: Number,
        required: true
    },
    quanity: {
        type: Number,
        default: 0
    },
    type: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Product', productSchema);