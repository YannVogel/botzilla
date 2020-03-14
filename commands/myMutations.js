const PlayerSheet = require('../models/playerSheet');
const cd = require('./dependencies/_deleteTimer');
const mutationsManager = require('./dependencies/_getFormattedPlayerMutations');
const powerManager = require('./dependencies/_getPlayerTotalPower');
const {powerFormat} = require('../gameConfig');

module.exports = {
    name: 'mymutations',
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
                return message.reply(`possède les mutations suivantes :\n${mutationsManager.getFormattedPlayerMutations(player, player.playerMutations)}.\nPour un total de \`${powerManager.getPlayerTotalPower(player)} ${powerFormat}\`.`);
            });
    }
};
