const PlayerSheet = require('../models/playerSheet');
const {currency} = require('../config');
const {devID} = process.env.DEV_ID || require('../auth');
const Discord = require('discord.js');
const {botAvatar} = require('../config');
const lvlManager = require('./dependencies/_getPlayerLevel');

module.exports = {
    name: 'moneystats',
    aliases: ['stats'],
    description: 'Affiche les joueurs classés par leurs gains',
    cooldown: 60,
    guildOnly: true,
    execute(message) {
        PlayerSheet.find().sort({playerPurse: 'desc'})
            .then(players => {
                let i = 0;
                const messageEmbed = new Discord.MessageEmbed()
                    .setTitle('Scores actuels')
                    .setColor('#cfbb72')
                    .setThumbnail(botAvatar);
                const playersList = players.map(player => {
                    // If the player is not the dev account...
                    if(player.playerId !== (process.env.DEV_ID || devID)) {
                        i++;
                        messageEmbed.addField(`${i}) ${player.playerName} (niv. ${lvlManager.getPlayerLevel(player)})`, `${player.playerPurse} ${currency}`, i > 3);
                    }
                });

                return message.channel.send(`Classement des joueurs :`)
                    .then(message.channel.send(messageEmbed));
            });
    }
};