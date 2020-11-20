const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
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
        type: 
        [
            {
                quantity: {
                    type: Number,
                    required: true
                },
                originalPrice: {
                    type: Number,
                    required: true
                },
                createDate: {
                    type: Date,
                    default: new Date()
                }
            }
        ],
        required: true
    },
    quantityType: {
        type: String,
        required: true
    },
    lastChangeDate: {
        type: Date,
        default: new Date()
    },
    createDate: {
        type: Date,
        default: new Date()
    },
    official: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Product', productSchema);