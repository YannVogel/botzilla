const rng = require('./_getRandomInt');
const items = require('./gameMarket').item;

const itemsList = {
    "forest": [
        "warp","grab","commonbag"
    ],
    "restaurant": [
        "salad","onigiri","coffee"
    ],
    "bank": [
        "commonbag","rarebag","epicbag"
    ],
    "factory": [
        "shower","vaderetro","coronavirus"
    ]
};

const frenchMapName = {
    "forest": "la forêt",
    "restaurant": "le restaurant",
    "bank": "la banque",
    "factory": "l'usine"
}

module.exports = {
    adventureSpecificMap: (player, map, message) => {
        // If the map is failed...
        if(rng.getRandomInt(100) + 1 > map.percentChanceToSuccess){
            return message.channel.send(`Après des heures à errer dans ${frenchMapName[map.name]}, <@${player.playerId}> se rend compte que l'expédition est un échec cuisant...`);
        }
        message.channel.send(`L'expédition de <@${player.playerId}> dans ${frenchMapName[map.name]} est une réussite !`)
            .then(() => {
                const wonItems = rng.getRandomInt(map.maxItems + 1);
                if(!wonItems) {
                    return message.channel.send(`Malheureusement <@${player.playerId}> n'a récupéré aucun objet...`);
                }

                let itemList = '';
                for(let i = 0; i < wonItems; i++){
                    let itemWon = itemsList[map.name][rng.getRandomInt(itemsList[map.name].length)];
                    items.map(item => {
                        if(itemWon === item.name) {
                            itemWon = item;
                        }
                    });
                    player.playerInventory.push(itemWon.name);
                    itemList += `${itemWon.icon} ${itemWon.name} `;
                }
                player.save();
                return message.channel.send(`<@${player.playerId}> a récupéré ${wonItems} objet${wonItems > 1 ? 's':''} : ${itemList}`);
                });
    }
};