const random = require('./dependencies/_getRandomInt.js');
const PlayerSheet = require('../models/playerSheet');
const playerManager = require('./dependencies/_getPlayerSheet');

module.exports = {
    name: 'fiche',
    description: "Affiche la fiche de personnage d'un joueur. La créée si elle n'existe pas.",
    guildOnly: true,
    cooldown: 30,
    execute(message) {
        async function getSheet() {
            const sheet = await playerManager.getPlayerSheet(message.author);
            return message.channel.send(sheet);
        }

        getSheet().catch(console.error);
    }
};