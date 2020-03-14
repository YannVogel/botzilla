/**
 * @class
 * @property {Number} id
 * @property {String} name
 * @property {String} icon
 * @property {Number} basicPower
 * @property {Number} maxMultiplier
 * @property {Object} componentAndQuantityRequired
 * @property {Number} price
 * @property {String} whenCrafted
 */
const {mutations} = require('./dependencies/mutations');
/**
 * @class
 * @property {Number} id
 * @property {String} name
 * @property {String} description
 * @property {String} icon
 */
const {materials} = require('./dependencies/materials');
const {currency} = require('../config');
const {prefix} = require('../config');
const Discord = require('discord.js');
const craftThumbnail = 'https://media0.giphy.com/media/N5Adsn0dgz6h2/giphy.gif';
const craftIcon = '🧬';
const PlayerSheet = require('../models/playerSheet');
const cd = require('./dependencies/_deleteTimer');
const inventoryManager = require('./dependencies/_getFormattedPlayerInventory');
const {powerFormat} = require('../gameConfig');

module.exports = {
    name: 'craft',
    description: 'Affiche les crafts disponibles',
    guildOnly: true,
    cooldown: 60,
    execute(message) {
        PlayerSheet.findOne({playerId: message.author.id})
            .then(player => {
                if (!player) {
                    cd.deleteTimer(message.author.id, this.name);
                    return message.reply(`Merci de commencer par créer ta fiche avec la commande ${prefix}fiche !`)
                }
                message.channel.send(`Bienvenue dans mon laboratoire, <@${player.playerId}> !`)
                    .then(message.channel.send(`__Voici les mutations que je peux te proposer :__`))
                    .then(() => {
                        const itemList = new Discord.MessageEmbed()
                            .setTitle(`${craftIcon} Laboratoire de mutations`)
                            .setThumbnail(craftThumbnail)
                        ;
                        mutations.map(mutation => {
                            let necessaryMaterials = '';
                            for(let [material, quantity] of Object.entries(mutation.componentAndQuantityRequired)) {
                                materials.map(mappedMaterial => {
                                    if (material === mappedMaterial.name) {
                                        necessaryMaterials += `${mappedMaterial.icon} ${mappedMaterial.name} **x${quantity}** | `;
                                    }
                                })
                            }
                            necessaryMaterials = necessaryMaterials.replace(/ \| $/, '');
                            const description = `__Pouvoir de base :__ ${mutation.basicPower} ${powerFormat}\n__Multiplicateur max :__ **${mutation.maxMultiplier}**\n__Matériaux nécessaires :__ ${necessaryMaterials}`;
                            return itemList.addField(`${mutation.icon}\`${mutation.name}\``, (mutation.eventPrice ? `~~${mutation.price}~~ => **${mutation.eventPrice} ${currency}**` : (player.playerPurse >= mutation.price ? `**${mutation.price} ${currency}**` : `~~${mutation.price} ${currency}~~`)) + `\n${description}`);
                        });

                        return message.channel.send(itemList)
                            .then(message.channel.send(`Tu possèdes actuellement \`${player.playerPurse} ${currency}\`.`))
                            .then(message.channel.send(`Tu possèdes actuellement ces matériaux : ${inventoryManager.getFormattedPlayerInventory(player.playerMaterials,true)}`))
                            .then(message.channel.send(`Tu peux créer une mutation avec la commande \`${prefix}craft\` suivi du nom de la mutation !`));
                    });
            });
    }
};