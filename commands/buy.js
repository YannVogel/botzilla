const items = require('./dependencies/gameMarket').item;
const PlayerSheet = require('../models/playerSheet');
const {currency} = require('../config');
const cd = require('./dependencies/_deleteTimer');


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
                if(player.playerPurse < desiredItem.price) {
                    cd.deleteTimer(message.author.id, this.name);
                    return message.reply(`Désolé mais tu n'as pas assez de ${currency}`)
                }
                player.playerInventory.push(desiredItem.name);
                player.playerPurse -= desiredItem.price;
                player.save();
                return message.reply(`a acheté un ${desiredItem.icon} \`${desiredItem.name}\` pour ${desiredItem.price} ${currency} !`);
            });

    }
};