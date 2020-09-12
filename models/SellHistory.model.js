const { ObjectID, ObjectId } = require('bson');
const mongoose = require('mongoose');

const sellHistorySchema = mongoose.Schema({
    productId: {
        type: ObjectId,
        required: true
    },
    sellDate: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('SellHistory', sellHistorySchema);