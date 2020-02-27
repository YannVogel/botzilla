const PlayerSheet = require('../models/playerSheet');
const {prefix} = require('../config');
const random = require('./dependencies/_getRandomInt');
const bagManager = require('./dependencies/_getRandomBag');
const {currency} = require('../config');
const cd = require('./dependencies/_deleteTimer');

module.exports = {
    name: 'loot',
    description: `Essayez de gagner le plus de ${currency} possible !!`,
    guildOnly: true,
    cooldown: 60*30,
    execute(message) {
        PlayerSheet.findOne({playerId: message.author.id})
            .then(player => {
                if(!player) {
                    cd.deleteTimer(message.author.id, this.name);
                    return message.reply(`Merci de commencer par créer ta fiche avec la commande ${prefix}fiche !`)
                }
                const rng = random.getRandomInt(100) + 1;

                return bagManager.getRandomBag(rng, message);
            })
    }
};