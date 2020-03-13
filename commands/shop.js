/**
 * @class
 * @property {Number} id
 * @property {String} name
 * @property {Number} price
 * @property {Number} eventPrice
 * @property {String} description
 * @property {String} icon
 * @property {String} whenUsed
 */
const items = require('./dependencies/gameMarket').item;
const {currency} = require('../config');
const {prefix} = require('../config');
const Discord = require('discord.js');
const shopThumbnail = 'https://i.ibb.co/bWp98QS/shop.png';
const shopIcon = ':convenience_store:';
const PlayerSheet = require('../models/playerSheet');
const cd = require('./dependencies/_deleteTimer');

module.exports = {
    name: 'shop',
    description: 'Affiche le magasin du jeu',
    guildOnly: true,
    cooldown: 60,
    execute(message) {
        PlayerSheet.findOne({playerId: message.author.id})
            .then(player => {
                if (!player) {
                    cd.deleteTimer(message.author.id, this.name);
                    return message.reply(`Merci de commencer par créer ta fiche avec la commande ${prefix}fiche !`)
                }
                message.channel.send(`Bienvenue dans mon humble magasin, <@${player.playerId}> !`)
                    .then(message.channel.send(`__Voici ce que j'ai en stock actuellement :__`))
                    .then(() => {
                        const itemList = new Discord.MessageEmbed()
                            .setTitle(`${shopIcon} La bobziBoutique`)
                            .setThumbnail(shopThumbnail)
                        ;
                        items.map(item => {
                            return itemList.addField(`${item.icon}\`${item.name}\``, (item.eventPrice ? `~~${item.price}~~ => **${item.eventPrice} ${currency}**` : (player.playerPurse >= item.price ? `**${item.price} ${currency}**` : `~~${item.price} ${currency}~~`)) + `\n${item.description}`, true);
                        });

                        return message.channel.send(itemList)
                            .then(message.channel.send(`Tu possèdes actuellement \`${player.playerPurse} ${currency}\`.`))
                            .then(message.channel.send(`Tu peux m'acheter un objet avec la commande \`${prefix}buy\` suivi du nom de l'objet !`));
                    });
            });
    }
};