const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const playerSheetSchema = mongoose.Schema({
    playerId: {type: String, required: true, unique: true},
    playerName: {type: String, required: true},
    playerExperience: {type: Number, required: true},
    playerPurse: {type: Number, required: true},
    playerInventory: {type: Array, required: true},
    createdAt: {type: Date, required: true},
    playerRuby: {type: Number, required: true},
    playerCurses: {type: Number, required: true},
    playerBuff: {type: Array, default: []},
    initiatedChallenge: {type: Number, default: 0},
    acceptedChallenge: {type: Number, default: 0},
    refusedChallenge: {type: Number, default: 0},
    wonChallenge: {type: Number, default: 0},
    lostChallenge: {type: Number, default: 0},
    playerStamina: {type: Number, default: 0},
    playerMaxStamina: {type: Number, default: 4444}
});

playerSheetSchema.plugin(uniqueValidator);

module.exports = mongoose.model('playerSheet', playerSheetSchema);