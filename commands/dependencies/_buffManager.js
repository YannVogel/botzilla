const  Discord = require('discord.js');
const random = require('./_getRandomInt.js');
const PlayerSheet = require('../../models/playerSheet');
const oneChanceInToGetABuff = 24;     // 1 chance in x to get a buff
const buff = require('./buff').buff;
const chanceToGetByRarity = [
    60, 85, 95, 100
];



module.exports = {
    getABuff: () => {
        return random.getRandomInt(oneChanceInToGetABuff) === 12;
    },

    addABuff: (player, message) => {
        const rng = random.getRandomInt(100)+1;
        let rarity;
        for(let i = 0; i < chanceToGetByRarity.length; i++){
            if(rng <= chanceToGetByRarity[i]){
                rarity = i+1;
                break;
            }
        }

        const arrayOfEligibleBuffs = buff.filter(x => x.rarityLevel === rarity);
        const wonBuff = arrayOfEligibleBuffs[random.getRandomInt(arrayOfEligibleBuffs.length)];
        const embedMessage = new Discord.MessageEmbed()
            .setColor('#ffffff')
            .setTitle(`${player.playerName} a trouvé un ${wonBuff.icon} !`)
            .addField("Bonus permanent", `+${wonBuff.percentBonus}% d'or trouvé dans les sacs !`)
            .setThumbnail(wonBuff.image);

        message.channel.send(`Fantastique ! Le sac trouvé par <@${player.playerId}> contenait un animal !`)
            .then(() => {
                message.reply(embedMessage)
                    .then(() => {
                        player.playerBuff.push(wonBuff.name);
                        player.save();
                    })
            })
    },
    getPlayerTotalBuff: player => {
        let playerTotalBuff = 0;
        if(player.playerBuff.length === 0){
            return playerTotalBuff;
        }

        buff.map(buff => {
            for(let i=0; i< player.playerBuff.length; i++){
                if(player.playerBuff[i] === buff.name){
                    playerTotalBuff += buff.percentBonus;
                }
            }
        });
        return playerTotalBuff;
    }
};