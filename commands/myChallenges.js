const PlayerSheet = require('../models/playerSheet');
const ChallengeLog = require('../models/challengeLog');
const Discord = require('discord.js');
const {currency} = require('../config');

module.exports = {
    name: 'mychallenges',
    description: 'Affiche les défis qui te concernent',
    cooldown: 60,
    execute(message) {
        PlayerSheet.findOne({playerId: message.author.id})
            .then(player => {
                // If the player is not in the DB...
                if(!player) {
                    return message.reply(`Merci de commencer par créer ta fiche avec la commande ${prefix}fiche !`)
                }
                ChallengeLog.find({initiatorId: message.author.id})
                    .then(initiatedChallenges => {
                        ChallengeLog.find({opponentId: message.author.id})
                            .then(proposedChallenges => {
                                if(!initiatedChallenges.length && !proposedChallenges.length) {
                                    return message.reply(`Il n'y a aucun défi en cours qui te concerne actuellement...`);
                                }
                                const initiatedList = initiatedChallenges.map(challenge => {
                                    return `vs \`${challenge.opponentName}\` (${challenge.amount} ${currency})`;
                                });
                                const proposedList = proposedChallenges.map(challenge => {
                                    return `vs \`${challenge.initiatorName}\` (${challenge.amount} ${currency})`;
                                });

                                return message.channel.send(
                                    new Discord.MessageEmbed()
                                        .setColor('#abc0d9')
                                        .setThumbnail(message.author.avatarURL())
                                        .setTitle(`Défis de ${player.playerName}`)
                                        .addField('Défis lancés :', initiatedList.length > 0 ? initiatedList : '0 défi')
                                        .addField('Défis à accepter :', proposedList.length > 0 ? proposedList : '0 défi')
                                );
                            });
                    });
            });

    }
};