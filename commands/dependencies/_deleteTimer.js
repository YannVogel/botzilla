const cooldowns = require('../../bot/events/onMessage').cooldowns;

module.exports = {
    deleteTimer: function(userId, commandName) {
        const timestamps = cooldowns.get(commandName);
        // Delete the CD of this command for an user with no argument indicated
        timestamps.delete(userId);
    }
}