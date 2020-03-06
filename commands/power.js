const PlayerSheet = require('../models/playerSheet');
const cd = require('./dependencies/_deleteTimer');
const powerManager = require('./dependencies/_getPlayerTotalPower');
const {powerFormat} = require('../gameConfig');

module.exports = {
    name: 'power',
    description: `Renseigne un joueur sur sa puissance actuelle`,
    guildOnly: true,
    cooldown: 60,
    execute(message) {
        PlayerSheet.findOne({playerId: message.author.id})
            .then(player => {
                if (!player) {
                    cd.deleteTimer(message.author.id, this.name);
                    return message.reply(`Merci de commencer par créer ta fiche avec la commande ${prefix}fiche !`)
                }
                return message.channel.send(`Puissance actuelle de <@${player.playerId}> : \`${powerManager.getPlayerTotalPower(player)} ${powerFormat}\``);
            });
    }
};