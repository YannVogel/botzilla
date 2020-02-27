const PlayerSheet = require('../models/playerSheet');
const {currency} = require('../config');
const {devID} = process.env.DEV_ID || require('../auth');

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
                let devPlace;
                const playersList = players.map(player => {
                    // If the player is not the dev account...
                    if(player.playerId !== process.env.DEV_ID || devID) {
                        i++;
                        return `${i}) <@${player.playerId}> - ${player.playerPurse} ${currency}`;
                    }else
                        //...otherwise, stores the dev account's place
                        devPlace = i;
                });
                // Deletes the dev account line of the Object
                playersList.splice(devPlace, 1);

                return message.channel.send(`Classement des joueurs :`)
                    .then(message.channel.send(playersList));
            });
    }
};