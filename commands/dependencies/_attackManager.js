const {getRandomInt} = require('./_getRandomInt');
const {getPlayerTotalPower} = require('./_getPlayerTotalPower');

module.exports = {
    determineWinner: (playerWithLesserPower, playerWithHigherPower) => {
        const lesserPower = getPlayerTotalPower(playerWithLesserPower);
        const higherPower = getPlayerTotalPower(playerWithHigherPower);
        const rng = getRandomInt(lesserPower + higherPower);
        console.log(`Résultat du combat ${playerWithLesserPower.playerName} (${lesserPower}) vs ${playerWithHigherPower.playerName} (${higherPower}) : ${rng}\n
        Vainqueur attendu : ${rng >= lesserPower ? playerWithHigherPower.playerName : playerWithLesserPower.playerName}`);
        return {
            winnerPlayer: rng >= lesserPower ? playerWithHigherPower : playerWithLesserPower,
            loserPlayer: rng >= lesserPower ? playerWithLesserPower : playerWithHigherPower,
            isResultUnexpected: rng < lesserPower
            }
        }
};