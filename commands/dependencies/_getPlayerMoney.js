const PlayerSheet = require('../../models/playerSheet');
const {prefix} = require('../../config');
const currency = 'bobzi$$';

module.exports = {
    getPlayerMoney: function (message) {
        PlayerSheet.findOne({playerId: message.author.id})
            .then(player => {
                if(!player)
                {
                    return message.reply(`Merci de commencer par créer ta fiche avec la commande ${prefix}fiche !`)
                }

                return message.reply(`possède actuellement \`${player.playerPurse} ${currency}\` !`);
            })
    }
};