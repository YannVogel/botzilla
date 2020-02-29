const manager = require('../_getRandomBag');

module.exports = {
    useBagItem: (player, message, quality) => {
        return message.channel.send(manager.getMoneyBag(player, quality));
    }
};