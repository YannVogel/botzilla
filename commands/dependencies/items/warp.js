const cd = require('../_deleteTimer');

module.exports = {
    useWarpItem: playerId => {
        return cd.deleteTimer(playerId, 'loot');
    }
};