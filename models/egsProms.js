const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const egsPromsSchema = mongoose.Schema({
    title: {type: String, required: true, unique: true},
    urlSource: {type: String, required: true},
    urlShop: {type: String, required: true},
    image: {type: String, required: false}
});

egsPromsSchema.plugin(uniqueValidator);

module.exports = mongoose.model('egsProms', egsPromsSchema);