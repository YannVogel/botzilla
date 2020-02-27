const PlayerSheet = require('../models/playerSheet');
const use = require('./dependencies/_useSpecificItem');
const items = require('./dependencies/gameMarket').item;

function thisPlayerHasThisItem (player, item) {
    for(let i = 0; i < player.playerInventory.length; i++) {
        if(item === player.playerInventory[i]) {
            return true;
        }
    }
    return false;
}

module.exports = {
    name: 'useitem',
    aliases: 'use',
    description: "Permet d'utiliser un objet possédé",
    guildOnly: true,
    cooldown: 60 * 60,
    execute(message, args) {
        if(!args[0]) {
            return message.reply('Tu dois préciser quel objet tu veux utiliser !');
        }
        if(args.length > 1) {
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

                        use.useSpecificItem(player, itemToUse.name);
                        player.playerInventory.splice( player.playerInventory.indexOf(itemToUse.name), 1);
                        player.save();
                        return message.reply(`a utilisé un ${itemToUse.icon} ${itemToUse.name} ! ${itemToUse.whenUsed}`)
                    }else {
                        return message.reply("Tu ne possèdes pas cet objet !");
                    }
                });
    }
};