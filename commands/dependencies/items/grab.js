const random = require('../_getRandomInt');
const {currency} = require('../../../config');
const {devID} = process.env.DEV_ID || require('../../../auth.json');
const PlayerSheet = require('../../../models/playerSheet');


module.exports = {
    useGrabItem: (player, message) => {
        const minTheftPercent = 5;
        const maxTheftPercent = 15;
        PlayerSheet.find()
            .then(data => {
                let victimId = process.env.DEV_ID || devID;

                while(victimId === (process.env.DEV_ID || devID)){
                    let rng = random.getRandomInt(data.length);
                    victimId = data[rng].playerId;
                }
                PlayerSheet.findOne({playerId: victimId})
                    .then(player2 => {
                        const theftPercent = random.getRandomInt(maxTheftPercent) + minTheftPercent;
                        const theftValue = Math.round(theftPercent*(player2.playerPurse/100));

                        // If the victim is not the thief himself
                        if(player.playerId !== player2.playerId) {
                            player2.playerPurse -= theftValue;
                            if(player2.playerPurse < 0) player2.playerPurse = 0;
                            player2.save()
                                .then(() => {
                                    player.playerPurse += theftValue;
                                    player.save();
                                    return message.channel.send(`<@${player.playerId}> a volé \`${theftValue} ${currency} (${theftPercent}%)\`  à <@${player2.playerId}> !!`);
                                });
                        }else {
                            return message.reply(`a tenté de se voler lui-même ${theftValue} (${theftPercent}%) ${currency}... Ça va ?`);
                        }
                    })
            });
    }
};