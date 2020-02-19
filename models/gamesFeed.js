const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const gamesFeedSchema = mongoose.Schema({
    game: {type: String, required: true},                       // Name of the game
    category: {type: String, required: true},                   // Category of the new
    title: {type: String, required: true},                      // Title of the new
    urlSource: {type: String, required: true, unique: true},    // Url of the new
    image: {type: String, required: false}                      // Image of the game or new
});

gamesFeedSchema.plugin(uniqueValidator);

module.exports = mongoose.model('gamesFeed', gamesFeedSchema);