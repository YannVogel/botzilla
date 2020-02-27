const PlayerSheet = require('../models/playerSheet');
const {prefix} = require('../config');
const format = require('./dependencies/_getFormattedPlayerInventory');
const cd = require('./dependencies/_deleteTimer');

module.exports = {
    name: 'inventory',
    description: `Renseigne un joueur sur son inventaire.`,
    cooldown: 60,
    execute(message) {
        PlayerSheet.findOne({playerId: message.author.id})
            .then(player => {
                if(!player)
                {
                    cd.deleteTimer(message.author.id, this.name);
                    return message.reply(`Merci de commencer par créer ta fiche avec la commande ${prefix}fiche !`)
                }

                return message.channel.send(`Inventaire actuel de <@${message.author.id}> : \n**${format.getFormattedPlayerInventory(player.playerInventory)}**`);
            })
    }
};