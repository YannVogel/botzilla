const warp = require('./warp');
const grab = require('./grab');
const bag = require('./bag');
const shower = require('./shower');
const vaderetro = require('./vaderetro');
const coronavirus = require('./coronavirus.js');

module.exports = {
    useSpecificItem: (player, itemName, message) => {
        switch(itemName) {
            case 'warp':
                warp.useWarpItem(player);
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
            case 'shower':
                shower.useShowerItem(player);
            break;
            case 'vaderetro':
                vaderetro.useVaderetroItem(player);
            break;
            case 'coronavirus':
                coronavirus.useCoronavirusItem(player, message);
            break;
            default:
                return;
        }
    }
};