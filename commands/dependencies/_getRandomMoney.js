const  Discord = require('discord.js');
const random = require('./_getRandomInt.js');
const PlayerSheet = require('../../models/playerSheet');
const maxCommon = 70;       // 1 <= common <= 70
const maxRare = 90;         // 71 <= rare <= 90
const maxEpic = 99;         // 91 <= epic <= 99
const maxCommonProfit = 10;
const maxRareProfit = 25;
const maxEpicProfit = 50;
const maxLegendaryProfit = 100;
const {currency} = require('../../config');
const extra = require('./_getExtraRuby');

const bagImages = {
  'common': 'https://i.ibb.co/4TjnvZk/common.png',
  'rare': 'https://i.ibb.co/RQqWPct/rare.png',
  'epic': 'https://i.ibb.co/GvR6vjV/epic.png',
  'legendary': 'https://i.ibb.co/wwzL7zq/legendary.png'
};

const bagFrName = {
    'common': 'commun',
    'rare': 'rare',
    'epic': 'épique',
    'legendary': 'légendaire'
};

const bagColor = {
    'common': '#71a600',
    'rare': '#00baff',
    'epic': '#ee01eb',
    'legendary': '#ffc000'
};

function getMoneyBag (player, maxProfit, quality, multiplier = 1) {
    const loot = (random.getRandomInt(maxProfit) + 1) * multiplier;

    PlayerSheet.findOne({playerId: player.id})
        .then(player => {
            player.playerPurse += loot;
            player.save();
        });
    return new Discord.MessageEmbed()
            .setColor(bagColor[quality])
            .setTitle(`Sac ${bagFrName[quality]}`)
            .addField(`Nombre de ${currency}`, loot, true)
            .setThumbnail(bagImages[quality]);
}

module.exports = {
    getRandomMoney: function(number, message) {
        const player = message.author;

        if(number <= maxCommon)
        {
            return message.reply(`a trouvé un sac ${bagFrName['common']}`)
                .then(message.channel.send(getMoneyBag(player, maxCommonProfit, 'common')))
                .then(() =>{
                        if(extra.getExtraRuby()) {
                            extra.rubyManager(player, message)
                        }
                });

        }else if(number <= maxRare)
        {
            return message.reply(`a trouvé un sac ${bagFrName['rare']}`)
                .then(message.channel.send(getMoneyBag(player, maxRareProfit, 'rare')))
                .then(() =>{
                    if(extra.getExtraRuby()) {
                        extra.rubyManager(player, message)
                    }
                });

        }else if(number <= maxEpic)
        {
            return message.reply(`a trouvé un sac ${bagFrName['epic']}`)
                .then(message.channel.send(getMoneyBag(player, maxEpicProfit, 'epic', 2)))
                .then(() =>{
                    if(extra.getExtraRuby()) {
                        extra.rubyManager(player, message)
                    }
                });

        }else   // Legendary = 100
        {
            return message.reply(`a trouvé un sac ${bagFrName['legendary']}`)
                .then(message.channel.send(getMoneyBag(player, maxLegendaryProfit, 'legendary', 4)))
                .then(() =>{
                    if(extra.getExtraRuby()) {
                        extra.rubyManager(player, message)
                    }
                });
        }

    }
};