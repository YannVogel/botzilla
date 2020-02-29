const cd = require('./dependencies/_deleteTimer');
const {prefix} = require('../config');
const PlayerSheet = require('../models/playerSheet');
const ChallengeLog = require('../models/challengeLog');
const {currency} = require('../config');
const dateFr = require('./dependencies/_getFrenchDate');

const challengeEmojis = {
    'initiator': '⚔️',
    'opponent': '🛡️'
};

module.exports = {
    name: 'challenge',
    description: 'Défi un joueur !',
    args: true,
    usage: '<@le joueur défié> <la somme mise en jeu>',
    cooldown: 60*60,
    execute(message, args) {
        const price = args[1];
        // If there is no user mentioned...
        if (!message.mentions.users.size) {
            cd.deleteTimer(message.author.id, this.name);
            return message.reply('Il faut mentionner le joueur que tu veux défier !');
        }
        // If there is more than 1 user mentioned...
        if(message.mentions.users.size > 1) {
            cd.deleteTimer(message.author.id, this.name);
            return message.reply("Tu ne peux défier qu'un joueur à la fois !");
        }
        // If there is more than 2 args OR the indicated price is not a number...
        if(args.length > 2 || isNaN(parseInt(price, 10))) {
            cd.deleteTimer(message.author.id, this.name);
            return message.reply(`Mauvaise utilisation de la commande ! Tu peux taper \`${prefix}help ${this.name}\` pour obtenir plus d'informations !`);
        }

        PlayerSheet.findOne({playerId: message.author.id})
            .then(initiatorPlayer => {
                // If the player is not in the DB...
                if(!initiatorPlayer) {
                    cd.deleteTimer(message.author.id, this.name);
                    return message.reply(`Merci de commencer par créer ta fiche avec la commande ${prefix}fiche !`)
                }
                // If the player doesn't have enough money...
                if(initiatorPlayer.playerPurse < price) {
                    cd.deleteTimer(message.author.id, this.name);
                    return message.reply(`Tu ne possèdes actuellement que \`${initiatorPlayer.playerPurse} ${currency}\`. Tu ne peux donc pas proposer un défi à \`${price} ${currency}\` !!`);
                }

                const opponent = message.mentions.users.map(user => {
                    return user;
                })[0];

                PlayerSheet.findOne({playerId: opponent.id})
                    .then(opponentPlayer => {
                        if(!opponentPlayer){
                            cd.deleteTimer(message.author.id, this.name);
                            return message.reply(`Désolé mais le joueur ${opponent} n'a pas encore créé sa fiche de jeu !`);
                        }
                        ChallengeLog.findOne({initiatorId: initiatorPlayer.playerId, opponentId: opponentPlayer.playerId})
                            .then(existingChallenge => {
                                if(existingChallenge) {
                                    cd.deleteTimer(message.author.id, this.name);
                                    return message.reply(`Désolé mais tu as déjà un défi en cours avec \`${existingChallenge.opponentName}\` (somme mise en jeu : \`${existingChallenge.amount}${currency}\`) qui date du \`${dateFr.getFrenchDate(existingChallenge.createdAt)}\` !`);
                                }
                                const newChallenge = new ChallengeLog({
                                    initiatorId: initiatorPlayer.playerId,
                                    initiatorName: initiatorPlayer.playerName,
                                    opponentId: opponentPlayer.playerId,
                                    opponentName: opponentPlayer.playerName,
                                    amount: price,
                                    createdAt: new Date()
                                });
                                newChallenge.save();
                                return message.channel.send(`${challengeEmojis['initiator']}<@${newChallenge.initiatorId}> vient de défier ${challengeEmojis['opponent']} <@${newChallenge.opponentId}> ! Somme mise en jeu : \`${newChallenge.amount} ${currency}\` !`)
                                    .then(() => {
                                        initiatorPlayer.initiatedChallenge++;
                                        initiatorPlayer.save();
                                    });
                            });
                    })
            });
    }
};