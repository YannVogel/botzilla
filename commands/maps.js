const maps = require('./dependencies/gameMarket').map;
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
                            const mapItemsList = map.itemList.toString().replace(/,/g,', ');
                            const description = `Permet de trouver entre 0 et ${map.maxItems} objet${map.maxItems > 1 ? 's' : ''} compris dans la liste : \n**[${mapItemsList}]**.\nChances de réussite : **${map.percentChanceToSuccess}%**.`;
                            return mapList.addField(`${map.icon}\`${map.name}\``, (player.playerStamina >= map.price ? `**${map.price} ${stamina}**` : `~~${map.price} ${stamina}~~`) + `\n${description}`);
                        });

                        return message.channel.send(mapList)
                            .then(message.channel.send(`Tu possèdes actuellement \`${player.playerStamina} ${stamina}\`.`))
                            .then(message.channel.send(`Tu peux tenter une map avec la commande \`${prefix}adventure\` suivi du nom de la map !`));
                    });
            });
    }
};