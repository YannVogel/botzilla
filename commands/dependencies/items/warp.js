const cooldowns = require('../../../bot/events/onMessage').cooldowns;

module.exports = {
    useWarpItem: player => {
        const timestamps = cooldowns.get('loot');
        if(timestamps && timestamps.has(player.playerId))
        {
            // Deletes the CD of the !loot command for the indicated user
            timestamps.delete(player.playerId);
        }else {
            player.playerInventory.push('warp');
            player.save();
        }
    }
};