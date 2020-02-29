const {prefix} = require('../config');
const PlayerSheet = require('../models/playerSheet');
const ChallengeLog = require('../models/challengeLog');

module.exports = {
    name: 'refusechallenge',
    aliases: ['refuse'],
    description: 'Refuse le défi lancé par un joueur',
    args: true,
    usage: '<@le joueur rival>',
    cooldown: 1,
    execute(message, args) {
        // If there is no user mentioned...
        if (!message.mentions.users.size) {
            return message.reply("Il faut mentionner le joueur qui t'a défié !");
        }
        // If there is more than 1 user mentioned...
        if (message.mentions.users.size > 1) {
            return message.reply("Tu ne peux refuser qu'un défi à la fois !");
        }
        // If there is more than 1 arg...
        if (args.length > 1) {
            return message.reply(`Mauvaise utilisation de la commande ! Tu peux taper \`${prefix}help ${this.name}\` pour obtenir plus d'informations !`);
        }

        PlayerSheet.findOne({playerId: message.author.id})
            .then(challengedPlayer => {
                // If the player is not in the DB...
                if (!challengedPlayer) {
                    return message.reply(`Merci de commencer par créer ta fiche avec la commande ${prefix}fiche !`)
                }

                const initiatorPlayer = message.mentions.users.map(user => {
                    return user;
                })[0];


                ChallengeLog.findOne({initiatorId: initiatorPlayer.id, opponentId: challengedPlayer.playerId})
                    .then(challenge => {
                        if(!challenge) {
                           return message.reply(`Tu n'as pas de défi en cours avec \`${initiatorPlayer.username}\` !`);
                        }

                        challenge.delete();
                        challengedPlayer.refusedChallenge++;
                        challengedPlayer.save();
                        return message.channel.send(`<@${challengedPlayer.playerId}> a refusé le défi lancé par <@${initiatorPlayer.id}> ! Huez-le !! 😈`)

                    })
            });
    }
};