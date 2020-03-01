const  Discord = require('discord.js');
const random = require('./_getRandomInt.js');
const maxCommon = 70;       // 1 <= common <= 70
const maxRare = 90;         // 71 <= rare <= 90
const maxEpic = 99;         // 91 <= epic <= 99
const maxCursedMalus = 25;      // max % to lose when looting a cursed bag
const {currency} = require('../../config');
const extra = require('./_getExtraRuby');
const cd = require('./_deleteTimer');
const gif = require('./_getGif');
const expManager = require('./_addExperience');
const maxExperience = 15;
const {experienceFormat} = require('../../gameConfig');

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

const bagSentence = {
    'common': "Plus de chance la prochaine fois !",
    'rare': "C'est pas mal du tout !",
    'epic': "C'est une super nouvelle !!",
    'legendary': "Quelle chance !!!"
};

const maxBagProfit = {
    'common': 25,
    'rare': 50,
    'epic': 100,
    'legendary': 500
};

const bagMultiplier = {
    'common': 1,
    'rare': 2,
    'epic': 3,
    'legendary': 4
};

function getCursedBag(percent, malus) {
    return new Discord.MessageEmbed()
        .setColor(bagColor['cursed'])
        .setTitle(`${bagEmoji['cursed']} Sac ${bagFrName['cursed']} niveau ${percent}`)
        .addField(`Malus de ${currency}`, `-${malus} (${percent}%)`, true)
        .setThumbnail(bagImages['cursed'])
}

function getMoneyBag (player, quality, message, experience = 0) {
    const loot = (random.getRandomInt(maxBagProfit[quality]) + 1) * bagMultiplier[quality];
    player.playerPurse += loot;
    player.playerExperience += experience;
    player.save();

    message.channel.send(gif.getMoneyBagGif(loot));

    return new Discord.MessageEmbed()
            .setColor(bagColor[quality])
            .setTitle(`${bagEmoji[quality]} Sac ${bagFrName[quality]}`)
            .addField(`Valeur du sac`, `${loot} ${currency}`, true)
            .setThumbnail(bagImages[quality]);
}

module.exports = {
    getRandomBag: (number, message, player) => {
        // 1 "chance" in 50 to get a cursed bag
        if(random.getRandomInt(50) === 4) {
            const malusPercent = random.getRandomInt(maxCursedMalus) + 1;
            let malus;

            malus = Math.round(malusPercent*(player.playerPurse/100));
            player.playerPurse -= malus;
            player.playerCurses++;
            player.save();

            return message.reply(`a trouvé un... Oh non ! C'est un ${bagEmoji['cursed']} sac ${bagFrName['cursed']}`)
                .then(message.channel.send(gif.getCursedBagGif(malusPercent)))
                .then(message.channel.send(getCursedBag(malusPercent, malus)));
        }
        // Not a cursed bag, then set the quality of the regular bag...
        let quality;
        const experience = expManager.addExperience(maxExperience);
        if(number <= maxCommon){ quality = "common"; }
        else if(number <= maxRare){ quality = "rare"; }
        else if(number <= maxEpic){ quality = "epic"; }
        else{ quality = "legendary"; }

        return message.reply(`a trouvé un ${bagEmoji[quality]} sac ${bagFrName[quality]} ! ${bagSentence[quality]} (\`+${experience}\` ${experienceFormat})`)
            .then(message.channel.send(getMoneyBag(player, quality, message, experience)))
            .then(() => {
                if(extra.getExtraRuby()) {
                    extra.rubyManager(player, message);
                }
            })
            .then(() => {
                // 1 chance in 10 not to trigger the CD
                if(random.getRandomInt(10) === 5)
                {
                cd.deleteTimer(player.playerId, 'loot');
                return message.channel.send(`Une distorsion de l'espace-temps a permis à <@${player.playerId}> de ne pas enclencher le CD de sa commande !loot !!`);
                }
            });
    },
    getMoneyBag,
    getCursedBag
};