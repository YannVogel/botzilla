const PlayerSheet = require('../models/playerSheet');
const use = require('./dependencies/items/_useSpecificItem');
/**
 * @class
 * @property {Number} id
 * @property {String} name
 * @property {Number} price
 * @property {String} description
 * @property {String} icon
 * @property {String} whenUsed
 */
const items = require('./dependencies/gameMarket').item;
const cd = require('./dependencies/_deleteTimer');
const expManager = require('./dependencies/_addExperience');
const maxExperience = 200;
const {experienceFormat} = require('../gameConfig');

function thisPlayerHasThisItem (player, item, materials = false) {
    const inventory = !materials ? player.playerInventory : player.playerMaterials;
    for(let i = 0; i < inventory.length; i++) {
        if(item === inventory[i]) {
            return true;
        }
    }
    return false;
}

module.exports = {
    name: 'useitem',
    aliases: ['use'],
    description: "Permet d'utiliser un objet possédé",
    guildOnly: true,
    cooldown: 60 * 60,
    execute(message, args) {
        if(!args[0]) {
            cd.deleteTimer(message.author.id, this.name);
            return message.reply('Tu dois préciser quel objet tu veux utiliser !');
        }
        if(args.length > 1) {
            cd.deleteTimer(message.author.id, this.name);
            return message.reply("Tu ne peux utiliser qu'un seul objet à la fois !");
        }

        let itemToUse = args[0];

        PlayerSheet.findOne({playerId: message.author.id})
            .then(player => {
                    if(thisPlayerHasThisItem(player, itemToUse)) {
                        items.map(item => {
                            if(itemToUse === item.name) {
                                itemToUse = item;
                            }
                        });
                        const experience = expManager.addExperience(player, maxExperience, message);
                        message.reply(`a utilisé un ${itemToUse.icon} \`${itemToUse.name}\` (\`+${experience}\` ${experienceFormat}) ! ${itemToUse.whenUsed}`)
                            .then(() => {
                                player.playerInventory.splice(player.playerInventory.indexOf(itemToUse.name), 1);
                                player.save()
                                    .then(() => {
                                        use.useSpecificItem(player, itemToUse.name, message);
                                    });
                            })
                    }else {
                        cd.deleteTimer(message.author.id, this.name);
                        return message.reply("Tu ne possèdes pas cet objet !");
                    }
                });
    },
    thisPlayerHasThisItem
};