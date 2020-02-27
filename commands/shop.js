const items = require('./dependencies/gameMarket').item;
const {currency} = require('../config');
const {prefix} = require('../config');

module.exports = {
    name: 'shop',
    description: 'Affiche le magasin du jeu',
    guildOnly: true,
    cooldown: 60,
    execute(message) {
        const player = message.author;
        message.channel.send(`Bienvenue dans mon humble magasin, <@${player.id}> !`)
            .then(message.channel.send(`__Voici ce que j'ai en stock actuellement :__`))
            .then(() => {
                const itemList = items.map(item => {
                    return `${item.icon}\`${item.name}\` : **${item.price} ${currency}**\n- ${item.description}`;
                });

                return message.channel.send(itemList)
                    .then(message.channel.send(`Tu peux m'acheter un objet avec la commande \`${prefix}buy\` suivi du nom de l'objet !`));
            });
    }
};