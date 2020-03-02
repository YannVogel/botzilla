const random = require('../_getRandomInt');
const {devID} = process.env.DEV_ID || require('../../../auth.json');
const PlayerSheet = require('../../../models/playerSheet');

module.exports = {
    useCoronavirusItem: (player, message) => {
        PlayerSheet.find()
            .then(data => {
                let victimId = process.env.DEV_ID || devID;

                while (victimId === (process.env.DEV_ID || devID)) {
                    let rng = random.getRandomInt(data.length);
                    victimId = data[rng].playerId;
                }
                PlayerSheet.findOne({playerId: victimId})
                    .then(victim => {
                        // If the victim is the user of the item...
                        if(player.playerId === victim.playerId)
                        {
                            player.playerCurses++;
                            player.save();
                            return message.channel.send(`<@${player.playerId}> se trompe dans ses incantations et se 💀 maudit lui-même ! Pas de chance !! 🙃`);
                        }else
                        {
                            victim.playerCurses++;
                            victim.save();
                            return message.channel.send(`<@${player.playerId}> vient de 💀 maudire <@${victim.playerId}> (+1 malédiction) !`);
                        }
                    });
            });
    }
};