const PlayerSheet = require('../models/playerSheet');
const cd = require('./dependencies/_deleteTimer');
const {prefix} = require('../config');
const thisPlayerHasThisItem = require('./useItem').thisPlayerHasThisItem;
const items = require('./dependencies/gameMarket').item;
const expManager = require('./dependencies/_addExperience');
const maxExperience = 500;
const multiplierIfItsASuccess = 2;
const {experienceFormat} = require('../gameConfig');
const qualityMap = ['common', 'rare', 'epic', 'legendary'];
const chanceToSuccess = {
    'common': 90,
    'rare': 75,
    'epic': 50
};
const rng = require('./dependencies/_getRandomInt');


module.exports = {
    name: 'improve',
    description: "Améliore la qualité d'un objet",
    usage: "<nom de l'objet à améliorer>",
    guildOnly: true,
    cooldown: 60*10,
    execute(message, args) {
        if (!args || args.length > 1) {
            return message.reply(`Mauvaise utilisation de la commande. Tape ${prefix}help ${this.name} pour plus d'informations.`);
        }

        PlayerSheet.findOne({playerId: message.author.id})
            .then(player => {
                if (!player) {
                    cd.deleteTimer(message.author.id, this.name);
                    return message.reply(`Merci de commencer par créer ta fiche avec la commande ${prefix}fiche !`)
                }
                let itemToImprove = args[0];
                if (itemToImprove.startsWith('legendary')) {
                    cd.deleteTimer(message.author.id, this.name);
                    return message.reply(`Désolé mais cet objet a déjà atteint sa qualité maximale...`);
                }
                if (!(itemToImprove.startsWith('common') || itemToImprove.startsWith('rare') || itemToImprove.startsWith('epic'))) {
                    cd.deleteTimer(message.author.id, this.name);
                    return message.reply(`Désolé mais je ne sais pas améliorer cet objet...`);
                }
                if (!thisPlayerHasThisItem(player, itemToImprove)) {
                    cd.deleteTimer(message.author.id, this.name);
                    return message.reply("Tu ne possèdes pas cet objet !");
                }
                if (!thisPlayerHasThisItem(player, 'stardust', true)) {
                    cd.deleteTimer(message.author.id, this.name);
                    return message.reply("Tu ne possèdes pas le matériau requis !");
                }
                items.map(item => {
                    if (itemToImprove === item.name) {
                        itemToImprove = item;
                    }
                });
                let improvedItem = '';
                let baseQuality = '';
                for (let i = 0; i < qualityMap.length; i++) {
                    if (itemToImprove.name.startsWith(qualityMap[i])) {
                        improvedItem = `${qualityMap[i + 1]}${itemToImprove.name.split(qualityMap[i])[1]}`;
                        baseQuality = qualityMap[i];
                    }
                }
                items.map(item => {
                    if (improvedItem === item.name) {
                        improvedItem = item;
                    }
                });

                if(rng.getRandomInt(100) + 1 > chanceToSuccess[baseQuality]){
                    const experience = expManager.addExperience(player, maxExperience, message);
                    return message.channel.send(`Malheureusement, l'amélioration de ${itemToImprove.icon} \`${itemToImprove.name}\` a échoué et l'objet a été perdu...`)
                        .then(() => {
                            player.playerInventory.splice(player.playerInventory.indexOf(itemToImprove.name), 1);
                            player.save();
                        })
                }
                const experience = expManager.addExperience(player, maxExperience*multiplierIfItsASuccess, message);
                return message.reply(`vient d'améliorer son ${itemToImprove.icon}\`${itemToImprove.name}\` en ${improvedItem.icon}\`${improvedItem.name}\` (\`+${experience}\` ${experienceFormat}) !`)
                    .then(() => {
                        player.playerInventory.splice(player.playerInventory.indexOf(itemToImprove.name), 1);
                        player.playerInventory.push(improvedItem.name);
                        player.playerMaterials.splice(player.playerMaterials.indexOf('stardust'), 1);
                        player.save();
                    });
            });
    }
};