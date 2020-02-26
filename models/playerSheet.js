const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const playerSheetSchema = mongoose.Schema({
    playerId: {type: String, required: true, unique: true},
    playerName: {type: String, required: true},
    playerExperience: {type: Number, required: true},
    playerPurse: {type: Number, required: true},
    playerInventory: {type: Array, required: true},
    createdAt: {type: Date, required: true},
    playerRuby: {type: Number, required: true}
});

playerSheetSchema.plugin(uniqueValidator);

module.exports = mongoose.model('playerSheet', playerSheetSchema);