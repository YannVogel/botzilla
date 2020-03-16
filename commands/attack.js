const PlayerSheet = require('../models/playerSheet');
const cd = require('./dependencies/_deleteTimer');
const {getRandomInt} = require('./dependencies/_getRandomInt');
const {devID} = process.env.DEV_ID || require('../auth.json');
const {getPlayerTotalPower} = require('./dependencies/_getPlayerTotalPower');
const {currency} = require('../config');
const minPercentToWin = 1;
const maxPercentToWin = 26 - minPercentToWin;       // max = 25%
const {powerFormat} = require('../gameConfig');
const icon = {
    'attacker': '🤜',
    'defender': '🤛'
};
const expManager = require('./dependencies/_addExperience');
const {experienceFormat} = require('../gameConfig');
const maxExperience = 1000;
const {determineWinner} = require('./dependencies/_attackManager');

module.exports = {
    name: 'attack',
    description: 'Attaque un joueur au hasard.',
    cooldown: 60 * 30,
    execute(message) {
        PlayerSheet.findOne({playerId: message.author.id})
            .then(attackingPlayer => {
                if (!attackingPlayer) {
                    cd.deleteTimer(message.author.id, this.name);
                    return message.reply(`Merci de commencer par créer ta fiche avec la commande ${prefix}fiche !`)
                }
                if(getPlayerTotalPower(attackingPlayer) === 0) {
                    cd.deleteTimer(message.author.id, this.name);
                    return message.reply(`Tu n'as pas de puissance d'attaque ! Obtiens-en d'abord avant d'essayer de te battre ! 😆`);
                }
                // Select all the players except the player who initiated the command && the dev player
                PlayerSheet.find({
                    $and: [
                        { playerId: {$ne: attackingPlayer.playerId} },
                        { $or: [
                                { playerId: {$ne: (process.env.DEV_ID || devID)}, }
                            ]},
                    ]
                })
                    .then(players => {
                        let defendingPlayer = players[getRandomInt(players.length)];
                        // Excludes players with no power
                        while(defendingPlayer.playerMutations.length === 0) {
                            defendingPlayer = players[getRandomInt(players.length)];
                        }
                        message.channel.send(`Un combat oppose (\`${getPlayerTotalPower(attackingPlayer)}\` ${powerFormat}) <@${attackingPlayer.playerId}> ${icon.attacker} vs ${icon.defender} <@${defendingPlayer.playerId}> (\`${getPlayerTotalPower(defendingPlayer)}\` ${powerFormat}) !`)
                            .then(() => {
                                let winner;
                                let loser;
                                let unexpectedResult;
                                // If the attacker has more power than the victim...
                                if(getPlayerTotalPower(attackingPlayer) > getPlayerTotalPower(defendingPlayer)) {
                                    const {winnerPlayer,loserPlayer, isResultUnexpected} = determineWinner(defendingPlayer, attackingPlayer);
                                    winner = winnerPlayer;
                                    loser = loserPlayer;
                                    unexpectedResult = isResultUnexpected;
                                }
                                // If the attacker has less power than the victim...
                                if(getPlayerTotalPower(attackingPlayer) < getPlayerTotalPower(defendingPlayer)) {
                                    const {winnerPlayer,loserPlayer, isResultUnexpected} =  determineWinner(attackingPlayer, defendingPlayer);
                                    winner = winnerPlayer;
                                    loser = loserPlayer;
                                    unexpectedResult = isResultUnexpected;
                                }
                                // If the attacker has the same power than the victim
                                if(getPlayerTotalPower(attackingPlayer) === getPlayerTotalPower(defendingPlayer)) {
                                    return message.channel.send(`La puissance de <@${attackingPlayer.playerId}> et <@${defendingPlayer.playerId}> est équivalente et s'annule !`);
                                }
                                const winPercent = getRandomInt(maxPercentToWin) + minPercentToWin;
                                const winValue = Math.round(winPercent*(loser.playerPurse/100));
                                winner.playerPurse += winValue;
                                loser.playerPurse -= winValue;
                                loser.save()
                                    .then(() => {
                                            if(!unexpectedResult) {
                                                message.channel.send(`Après un duel acharné, <@${winner.playerId}> inflige le coup de grâce à <@${loser.playerId}> !`);
                                            }else {
                                                message.channel.send(`Contre toute attente, <@${winner.playerId}> terrasse <@${loser.playerId}> !`);
                                            }
                                            const experience = expManager.addExperience(winner, maxExperience, message);
                                            winner.save()
                                                .then(message.channel.send(`<@${winner.playerId}> a volé \`${winValue} ${currency}\` (\`${winPercent}%\`) à <@${loser.playerId}> et a gagné \`+${experience}\` ${experienceFormat} !`))
                                            });
                                    });
                            });
                    });
            }
};