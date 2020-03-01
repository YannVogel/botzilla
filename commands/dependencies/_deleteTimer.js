const cooldowns = require('../../bot/events/onMessage').cooldowns;

module.exports = {
    deleteTimer: function(userId, commandName) {
        const timestamps = cooldowns.get(commandName);
        if(timestamps && timestamps.has(userId))
        {
            // Deletes the CD of the indicated command for the indicated user
            timestamps.delete(userId);
        }
    }
}