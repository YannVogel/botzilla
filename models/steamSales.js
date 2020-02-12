const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const steamSalesSchema = mongoose.Schema({
    gameLink: {type: String, required: true, unique: true},
    createdAt: {type: Date, required: true}                 // Will be useful to update the DB (and delete the old sales)
});

steamSalesSchema.plugin(uniqueValidator);

module.exports = mongoose.model('steamSales', steamSalesSchema);