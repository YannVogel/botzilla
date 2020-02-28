const  Discord = require('discord.js');
const random = require('./_getRandomInt.js');
const PlayerSheet = require('../../models/playerSheet');
const maxCommon = 70;       // 1 <= common <= 70
const maxRare = 90;         // 71 <= rare <= 90
const maxEpic = 99;         // 91 <= epic <= 99
const maxCommonProfit = 25;
const maxRareProfit = 50;
const maxEpicProfit = 100;
const maxLegendaryProfit = 500;
const maxCursedMalus = 25;      // max % to lose when dropping a cursed bag
const {currency} = require('../../config');
const extra = require('./_getExtraRuby');

const bagImages = {
    'common': 'https://i.ibb.co/HT1SqDg/common.png',
    'rare': 'https://i.ibb.co/djqWBFc/rare.png',
    'epic': 'https://i.ibb.co/1MnH97n/epic.png',
    'legendary': 'https://i.ibb.co/PQ2VRZ7/legendary.png',
    'cursed': 'https://i.ibb.co/0YXj1hS/cursed.png'
};

const bagFrName = {
    'common': 'commun',
    'rare': 'rare',
    'epic': 'épique',
    'legendary': 'légendaire',
    'cursed': 'maudit'
};

const bagColor = {
    'common': '#71a600',
    'rare': '#00baff',
    'epic': '#ee01eb',
    'legendary': '#ffc000',
    'cursed': '#000000'
};

const bagEmoji = {
    'common': '🟢',
    'rare': '🔵',
    'epic': '🟣',
    'legendary': '🟠',
    'cursed': '💀'
};

function getCursedBag(percent, malus) {
    return new Discord.MessageEmbed()
        .setColor(bagColor['cursed'])
        .setTitle(`${bagEmoji['cursed']} Sac ${bagFrName['cursed']} niveau ${percent}`)
        .addField(`Malus de ${currency}`, `-${malus} (${percent}%)`, true)
        .setThumbnail(bagImages['cursed'])
}

function getMoneyBag (player, maxProfit, quality, multiplier = 1) {
    const loot = (random.getRandomInt(maxProfit) + 1) * multiplier;

    PlayerSheet.findOne({playerId: player.id})
        .then(player => {
            player.playerPurse += loot;
            player.save();
        });
    return new Discord.MessageEmbed()
            .setColor(bagColor[quality])
            .setTitle(`${bagEmoji[quality]} Sac ${bagFrName[quality]}`)
            .addField(`Nombre de ${currency}`, loot, true)
            .setThumbnail(bagImages[quality]);
}

module.exports = {
    getRandomBag: function(number, message) {
        const player = message.author;
        let quality;

        // 1 "chance" in 50 to get a cursed bag
        if(random.getRandomInt(50) === 4) {
            const malusPercent = random.getRandomInt(maxCursedMalus) + 1;
            let malus;
            return PlayerSheet.findOne({playerId: player.id})
                .then(player => {
                    malus = Math.round(malusPercent*(player.playerPurse/100));
                    player.playerPurse -= malus;
                    player.playerCurses++;
                    player.save();

                    return message.reply(`a trouvé un... Oh non ! C'est un ${bagEmoji['cursed']} sac ${bagFrName['cursed']}`)
                        .then(message.channel.send(getCursedBag(malusPercent, malus)));
                });
        }

        if(number <= maxCommon)
        {
            quality = "common";
            return message.reply(`a trouvé un ${bagEmoji[quality]} sac ${bagFrName[quality]}.`)
                .then(message.channel.send(getMoneyBag(player, maxCommonProfit, quality)))
                .then(() =>{
                        if(extra.getExtraRuby()) {
                            extra.rubyManager(player, message)
                        }
                });

        }else if(number <= maxRare)
        {
            quality = "rare";
            return message.reply(`a trouvé un ${bagEmoji[quality]} sac ${bagFrName[quality]} ! Pas mal !`)
                .then(message.channel.send(getMoneyBag(player, maxRareProfit, quality, 2)))
                .then(() =>{
                    if(extra.getExtraRuby()) {
                        extra.rubyManager(player, message)
                    }
                });

        }else if(number <= maxEpic)
        {
            quality = "epic";
            return message.reply(`a trouvé un ${bagEmoji[quality]} sac ${bagFrName[quality]} ! Super !!`)
                .then(message.channel.send(getMoneyBag(player, maxEpicProfit, quality, 3)))
                .then(() =>{
                    if(extra.getExtraRuby()) {
                        extra.rubyManager(player, message)
                    }
                });

        }else   // Legendary = 100
        {
            quality = "legendary";
            return message.reply(`a trouvé un ${bagEmoji[quality]} sac ${bagFrName[quality]} ! QUELLE CHANCE !!!`)
                .then(message.channel.send(getMoneyBag(player, maxLegendaryProfit, quality, 4)))
                .then(() =>{
                    if(extra.getExtraRuby()) {
                        extra.rubyManager(player, message)
                    }
                });
        }

    }
};