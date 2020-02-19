const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const roleMessagesSchema = mongoose.Schema({
    guildId: {type: String, required: true},                      // The id of the guild
    guildName: {type: String, required: true},
    roleId: {type: String, required: true},                       // The id of the role
    roleName: {type: String, required: true},
    messageId: {type: String, required: true, unique: true}     // Id of the message to cache

});

roleMessagesSchema.plugin(uniqueValidator);

module.exports = mongoose.model('roleMessages', roleMessagesSchema);