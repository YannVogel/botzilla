/**
 * @class
 * @property {String} name
 * @property {String} frenchName
 * @property {boolean} materialsMap
 * @property {Number} price
 * @property {Number} maxItems
 * @property {Array} itemList
 * @property {String} icon
 * @property {Number} percentChanceToSuccess
 */
const maps = require('./dependencies/gameMarket').map;
const PlayerSheet = require('../models/playerSheet');
const {stamina} = require('../config');
const cd = require('./dependencies/_deleteTimer');
const expManager = require('./dependencies/_addExperience');
const maxExperience = 500; //maxExperience if not a success, otherwise maxExperience*2
const {experienceFormat} = require('../gameConfig');
const mapManager = require('./dependencies/_adventureSpecificMap');

module.exports = {
    name: 'adventure',
    description: "Permet de tenter une map.",
    guildOnly: true,
    cooldown: 60*10,
    execute(message, args) {
        if(!args[0]) {
            cd.deleteTimer(message.author.id, this.name);
            return message.reply("Tu dois m'indiquer la map que tu souhaites explorer !");
        }
        if(args.length > 1) {
            cd.deleteTimer(message.author.id, this.name);
            return message.reply("Tu ne peux explorer qu'une map à la fois !");
        }
        let isMapInShop = false;
        let desiredMap = args[0].toLowerCase();
        maps.map(map => {
            if(desiredMap === map.name) {
                desiredMap = map;
                return isMapInShop = true;
            }
        });
        if(!isMapInShop) {
            cd.deleteTimer(message.author.id, this.name);
            return message.reply("Désolé mais je ne possède pas cette map actuellement...");
        }

        PlayerSheet.findOne({playerId: message.author.id})
            .then(player => {
                if (!player) {
                    cd.deleteTimer(message.author.id, this.name);
                    return message.reply(`Merci de commencer par créer ta fiche avec la commande ${prefix}fiche !`)
                }
                if(player.playerStamina < desiredMap.price) {
                    cd.deleteTimer(message.author.id, this.name);
                    return message.reply(`Désolé mais tu n'as pas assez de ${stamina}...`)
                }
                player.playerStamina -= desiredMap.price;
                return message.reply(`tente de réaliser la map ${desiredMap.icon} \`${desiredMap.name}\`! (\`-${desiredMap.price}\` ${stamina})`)
                    .then(() => {
                        player.save()
                            .then(() => {
                                const isMapASuccess = mapManager.adventureSpecificMap(player, desiredMap, message);
                                const experience = expManager.addExperience(player, isMapASuccess ? maxExperience*2 : maxExperience, message);
                                return message.reply(` a gagné \`+${experience}\` ${experienceFormat} en explorant la map ${desiredMap.icon} \`${desiredMap.name}\`.`);
                            })
                    });
            });
    }
};