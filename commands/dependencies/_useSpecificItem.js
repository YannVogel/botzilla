const cd = require('../dependencies/_deleteTimer');

module.exports = {
    useSpecificItem: (player, itemName) => {
        switch(itemName) {
            case 'warp':
                cd.deleteTimer(player.playerId, 'loot');
            break;
            default:
                return;
        }
    }
};