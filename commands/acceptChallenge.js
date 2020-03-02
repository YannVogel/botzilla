const {prefix} = require('../config');
const PlayerSheet = require('../models/playerSheet');
const ChallengeLog = require('../models/challengeLog');
const {currency} = require('../config');
const random = require('./dependencies/_getRandomInt.js');
const expManager = require('./dependencies/_addExperience');
const {experienceFormat} = require('../gameConfig');

module.exports = {
    name: 'acceptchallenge',
    aliases: ['accept'],
    description: 'Accepte le défi lancé par un joueur',
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
            return message.reply("Tu ne peux accepter qu'un défi à la fois !");
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
                        if (!challenge) {
                            return message.reply(`Tu n'as pas de défi en cours avec \`${initiatorPlayer.username}\` !`);
                        }
                        // If the challenged player doesn't have the amount of the challenge
                        if(challengedPlayer.playerPurse < challenge.amount) {
                            return message.reply(`Tu ne possèdes que ${challengedPlayer.playerPurse} ${currency} et le défi est fixé à ${challenge.amount} ${currency} ! Gagne encore un peu d'argent avant de l'accepter !`);
                        }
                        PlayerSheet.findOne({playerId: initiatorPlayer.id})
                            .then(initiatorPlayer => {
                                // If the initiator player doesn't have the amount of the challenge
                                if(initiatorPlayer.playerPurse < challenge.amount) {
                                    return message.reply(`\`${initiatorPlayer.playerName}\` ne possèdes que ${challengedPlayer.playerPurse} ${currency} et le défi est fixé à ${challenge.amount} ${currency} ! Attends qu'il ait la somme requise avant d'accepter ce défi !`);
                                }
                                // initiatorPlayer wins
                                let winner = initiatorPlayer;
                                let loser = challengedPlayer;
                                const challengePrice = challenge.amount;
                                // challengedPlayer wins if result = 1
                                if(random.getRandomInt(2)) {
                                    winner = challengedPlayer;
                                    loser = initiatorPlayer;
                                }
                                const winExperience = expManager.addExperience(winner, challenge.amount, message);
                                const loseExperience = expManager.addExperience(loser, Math.round(challenge.amount/3), message);

                                winner.playerPurse += challenge.amount;
                                winner.wonChallenge++;
                                winner.playerExperience += winExperience;
                                winner.save()
                                    .then(() => {
                                        loser.playerPurse -= challenge.amount;
                                        loser.lostChallenge++;
                                        loser.playerExperience += loseExperience;
                                        loser.save()
                                            .then(challenge.delete())
                                            .then(() => {
                                                challengedPlayer.acceptedChallenge++;
                                                challengedPlayer.save();
                                            });
                                    });
                                return message.channel.send(`<@${winner.playerId}> (\`+${winExperience}\` ${experienceFormat}) a remporté le défi face à <@${loser.playerId}> (\`+${loseExperience}\` ${experienceFormat}) ! Il dépouille son adversaire de \`${challengePrice} ${currency}\` !!`);
                            });
                    });
            });
    }
};