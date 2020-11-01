const mongoose = require('mongoose');

const parameterSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    parameterType: {
        type: String,
        required: true
    },
    value: {
        type: String
    }
});

module.exports = mongoose.model('Parameter', parameterSchema);