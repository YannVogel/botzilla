const PlayerSheet = require('../models/playerSheet');
const {currency} = require('../config');

module.exports = {
    name: 'moneystats',
    aliases: 'stats',
    description: 'Affiche les joueurs classés par leurs gains',
    cooldown: 60,
    guildOnly: true,
    execute(message) {
        PlayerSheet.find().sort({playerPurse: 'desc'})
            .then(players => {
                let i = 0;
                const playersList = players.map(player => {
                    i++;
                    return `${i}) <@${player.playerId}> - ${player.playerPurse} ${currency}`;
                });

                return message.channel.send(`Classement des joueurs :`)
                    .then(message.channel.send(playersList));
            });
    }
};