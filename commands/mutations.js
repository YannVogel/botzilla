const PlayerSheet = require('../models/playerSheet');
const cd = require('./dependencies/_deleteTimer');
const mutationsManager = require('./dependencies/_getFormattedPlayerMutations');

module.exports = {
    name: 'mutations',
    description: `Renseigne un joueur sur les mutations qu'il a acquises`,
    guildOnly: true,
    cooldown: 60,
    execute(message) {
        PlayerSheet.findOne({playerId: message.author.id})
            .then(player => {
                if (!player) {
                    cd.deleteTimer(message.author.id, this.name);
                    return message.reply(`Merci de commencer par créer ta fiche avec la commande ${prefix}fiche !`)
                }
                return message.reply(`possède les mutations suivantes : ${mutationsManager.getFormattedPlayerMutations(player.playerMutations)}`);
            });
    }
};
