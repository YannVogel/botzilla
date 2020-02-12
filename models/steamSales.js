const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const steamSalesSchema = mongoose.Schema({
    gameLink: {type: String, required: true, unique: true}
});

steamSalesSchema.plugin(uniqueValidator);

module.exports = mongoose.model('steamSales', steamSalesSchema);