const PlayerSheet = require('../models/playerSheet');
const {prefix} = require('../config');
const random = require('./dependencies/_getRandomInt');
const randomMoney = require('./dependencies/_getRandomMoney');
const {currency} = require('../config');

module.exports = {
    name: 'loot',
    description: `Essayez de gagner le plus de ${currency} possible !!`,
    guildOnly: true,
    cooldown: 60*30,
    execute(message) {
        PlayerSheet.findOne({playerId: message.author.id})
            .then(player => {
                if(!player) {
                    return message.reply(`Merci de commencer par créer ta fiche avec la commande ${prefix}fiche !`)
                }

                const rng = random.getRandomInt(100) + 1;

                return randomMoney.getRandomMoney(rng, message);
            })
    }
};