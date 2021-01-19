const mongoose = require('mongoose');

const managementSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model('Management', managementSchema);