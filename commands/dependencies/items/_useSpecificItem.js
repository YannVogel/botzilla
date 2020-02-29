const warp = require('./warp');
const grab = require('./grab');
const bag = require('./bag');

module.exports = {
    useSpecificItem: (player, itemName, message) => {
        switch(itemName) {
            case 'warp':
                warp.useWarpItem(player.playerId);
            break;
            case 'grab':
                grab.useGrabItem(player, message);
            break;
            case 'commonbag':
                bag.useBagItem(player, message, 'common');
            break;
            case 'rarebag':
                bag.useBagItem(player, message, 'rare');
            break;
            case 'epicbag':
                bag.useBagItem(player, message, 'epic');
            break;
            case 'legendarybag':
                bag.useBagItem(player, message, 'legendary');
            break;
            default:
                return;
        }
    }
};