const warp = require('./warp');
const grab = require('./grab');

module.exports = {
    useSpecificItem: (player, itemName, message) => {
        switch(itemName) {
            case 'warp':
                warp.useWarpItem(player.playerId);
            break;
            case 'grab':
                grab.useGrabItem(player, message);
            break;
            default:
                return;
        }
    }
};