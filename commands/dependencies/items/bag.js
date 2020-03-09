const manager = require('../_getRandomBag');
const buffManager = require('../_buffManager');

module.exports = {
    useBagItem: (player, message, quality) => {
        return message.channel.send(manager.getMoneyBag(player, quality, message, player.playerCurses, buffManager.getPlayerTotalBuff(player)));
    }
};