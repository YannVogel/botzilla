/**
 * @class
 * @property {String} name
 * @property {String} frenchName
 * @property {boolean} materialsMap
 * @property {Number} price
 * @property {Number} eventPrice
 * @property {Number} maxItems
 * @property {Array} itemList
 * @property {String} icon
 * @property {Number} percentChanceToSuccess
 */
const maps = require('./dependencies/gameMarket').map;
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
/**
 * @class
 * @property {Number} id
 * @property {String} name
 * @property {String} description
 * @property {String} icon
 */
const materials = require('./dependencies/materials').materials;
const {prefix} = require('../config');
const Discord = require('discord.js');
const shopThumbnail = 'https://i.ibb.co/vxk3mK0/shop-Thumbnail.png';
const shopIcon = ':map:';
const PlayerSheet = require('../models/playerSheet');
const cd = require('./dependencies/_deleteTimer');
const {stamina} = require('../config');

module.exports = {
    name: 'maps',
    description: 'Affiche les maps disponibles',
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
                    .then(message.channel.send(`__Voici les maps que j'ai trouvées :__`))
                    .then(() => {
                        const mapList = new Discord.MessageEmbed()
                            .setTitle(`${shopIcon} Maps disponibles`)
                            .setThumbnail(shopThumbnail)
                        ;
                        maps.map(map => {
                            let mapItemsList = '';
                             map.itemList.map(mapItem => {
                                 if(!map.materialsMap){
                                     items.map(item => {
                                         if(mapItem === item.name){
                                             mapItemsList += `${item.icon} ${item.name} `;
                                         }
                                     })
                                 }else {
                                     materials.map(material => {
                                         if(mapItem === material.name){
                                             mapItemsList += `${material.icon} ${material.name} `;
                                         }
                                     })
                                 }
                            });
                            const description = `Permet de trouver entre 0 et ${map.maxItems} ${!map.materialsMap ? '**objet' : '**matériau'}${map.maxItems > 1 ? (!map.materialsMap ? 's**' : 'x**') : '**'} compris dans la liste : \n**${mapItemsList}**\nChances de réussite : **${map.percentChanceToSuccess}%**.`;
                            return mapList.addField(`${map.icon}\`${map.name}\``, (map.eventPrice ? `~~${map.price}~~ => **${map.eventPrice} ${stamina}**` : (player.playerStamina >= map.price ? `**${map.price} ${stamina}**` : `~~${map.price} ${stamina}~~`)) + `\n${description}`);
                        });

                        return message.channel.send(mapList)
                            .then(message.channel.send(`Tu possèdes actuellement \`${player.playerStamina} ${stamina}\`.`))
                            .then(message.channel.send(`Tu peux tenter une map avec la commande \`${prefix}adventure\` suivi du nom de la map !`));
                    });
            });
    }
};