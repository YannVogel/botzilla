const rng = require('./_getRandomInt');
/**
 * @class
 * @property {Number} id
 * @property {String} name
 * @property {Number} price
 * @property {String} description
 * @property {String} icon
 * @property {String} whenUsed
 */
const items = require('./gameMarket').item;
/**
 * @class
 * @property {Number} id
 * @property {String} name
 * @property {String} description
 * @property {String} icon
 */
const materials = require('./materials').materials;

module.exports = {
    adventureSpecificMap: (player, map, message) => {
        // If the map is failed...
        if(rng.getRandomInt(100) + 1 > map.percentChanceToSuccess){
            message.channel.send(`Après des heures à errer dans ${map.frenchName}, <@${player.playerId}> se rend compte que l'expédition est un ❌\`échec cuisant\`...`);
            // Map is not a success...
            return false;
        }
        message.channel.send(`L'expédition de <@${player.playerId}> dans ${map.frenchName} est une ✅\`réussite\` !`)
            .then(() => {
                const wonItems = rng.getRandomInt(map.maxItems + 1);
                if(!wonItems) {
                    return message.channel.send(`Malheureusement <@${player.playerId}> n'a récupéré aucun objet 😔 ...`);
                }

                let itemsList = '';
                for(let i = 0; i < wonItems; i++){
                    let itemWon = map.itemList[rng.getRandomInt(map.itemList.length)];
                    if(!map.materialsMap){
                        items.map(item => {
                            if(itemWon === item.name) {
                                itemWon = item;
                            }
                        });
                        player.playerInventory.push(itemWon.name);
                        itemsList += `${itemWon.icon} ${itemWon.name} `;
                    }else {
                        materials.map(material => {
                            if(itemWon === material.name) {
                                itemWon = material;
                            }
                        });
                        player.playerMaterials.push(itemWon.name);
                        itemsList += `${itemWon.icon} ${itemWon.name} `;
                    }
                }
                player.save();
                return message.channel.send(`<@${player.playerId}> a récupéré ${wonItems} objet${wonItems > 1 ? 's':''} : ${itemsList}`);
                });
        // Map is a success...
        return true;
    }
};