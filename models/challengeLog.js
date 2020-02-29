const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const challengeLogSchema = mongoose.Schema({
    initiatorId: {type: String, required: true},
    initiatorName: {type: String, required: true},
    opponentId: {type: String, required: true},
    opponentName: {type: String, required: true},
    amount: {type: Number, required: true},
    createdAt: {type: Date, required: true}
});

challengeLogSchema.plugin(uniqueValidator);

module.exports = mongoose.model('challengeLog', challengeLogSchema);