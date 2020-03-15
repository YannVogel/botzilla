/**
 * @class
 * @property {Number} id
 * @property {String} name
 * @property {Number} price
 * @property {Number} eventPrice
 * @property {String} description
 * @property {String} icon
 * @property {String} whenUsed
 * @property {Number} maxToBuy
 */
const items = require('./dependencies/gameMarket').item;
const PlayerSheet = require('../models/playerSheet');
const {currency} = require('../config');
const cd = require('./dependencies/_deleteTimer');
const expManager = require('./dependencies/_addExperience');
const maxExperience = 250;
const {experienceFormat} = require('../gameConfig');
const {thisPlayerHasThisItem} = require('./useItem');

module.exports = {
    name: 'buy',
    description: "Permet d'acheter un objet au marchand.",
    guildOnly: true,
    cooldown: 60*10,
    execute(message, args) {
        if(!args[0]) {
            cd.deleteTimer(message.author.id, this.name);
            return message.reply("Tu dois m'indiquer l'objet que tu souhaites acheter !");
        }
        if(args.length > 1) {
            cd.deleteTimer(message.author.id, this.name);
            return message.reply("Tu ne peux acheter qu'un objet à la fois !");
        }
        let isItemInShop = false;
        let desiredItem = args[0].toLowerCase();
        items.map(item => {
            if(desiredItem === item.name) {
                desiredItem = item;
                return isItemInShop = true;
            }
        });
        if(!isItemInShop) {
            cd.deleteTimer(message.author.id, this.name);
            return message.reply("Désolé mais je ne possède pas cet objet dans mon stock...");
        }

        PlayerSheet.findOne({playerId: message.author.id})
            .then(player => {
                if (!player) {
                    cd.deleteTimer(message.author.id, this.name);
                    return message.reply(`Merci de commencer par créer ta fiche avec la commande ${prefix}fiche !`)
                }
                if(player.playerPurse < (desiredItem.eventPrice ? desiredItem.eventPrice : desiredItem.price)) {
                    cd.deleteTimer(message.author.id, this.name);
                    return message.reply(`Désolé mais tu n'as pas assez de ${currency}`)
                }
                // If the player has already bought the maximum of this item
                if(desiredItem.maxToBuy && thisPlayerHasThisItem(player, desiredItem.name, false, desiredItem.maxToBuy)){
                    cd.deleteTimer(message.author.id, this.name);
                    return message.reply(`Désolé mais tu as déjà trop de ${desiredItem.icon}\`${desiredItem.name}\` dans ton inventaire !`);
                }
                const experience = expManager.addExperience(player, maxExperience, message);
                player.playerInventory.push(desiredItem.name);
                player.playerPurse -= desiredItem.eventPrice ? desiredItem.eventPrice : desiredItem.price;
                player.save()
                    .then(() => {
                        return message.reply(`a acheté un ${desiredItem.icon} \`${desiredItem.name}\` pour ${desiredItem.eventPrice ? desiredItem.eventPrice : desiredItem.price} ${currency} (\`+${experience}\` ${experienceFormat}) !`);
                    });
            });
    }
};