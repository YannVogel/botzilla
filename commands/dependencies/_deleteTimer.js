const cooldowns = require('../../bot/events/onMessage').cooldowns;

module.exports = {
    deleteTimer: function(userId, commandName) {
        const timestamps = cooldowns.get(commandName);
        // Deletes the CD of the indicated command for the indicated user
        timestamps.delete(userId);
    }
}