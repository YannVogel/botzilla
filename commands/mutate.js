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
const PlayerSheet = require('../models/playerSheet');
const cd = require('./dependencies/_deleteTimer');
const inventoryManager = require('./dependencies/_getFormattedPlayerInventory');
const {powerFormat} = require('../gameConfig');
const thisPlayerHasThisMaterial = require('./useItem').thisPlayerHasThisItem;
const mutationManager = require('./dependencies/_mutationManager');
const expManager = require('./dependencies/_addExperience');
const {experienceFormat} = require('../gameConfig');
const maxExperience = 5000;

module.exports = {
    name: 'mutate',
    description: 'Ajoute une mutation au joueur',
    guildOnly: true,
    cooldown: 60*30,
    execute(message, args) {
        PlayerSheet.findOne({playerId: message.author.id})
            .then(player => {
                if (!player) {
                    cd.deleteTimer(message.author.id, this.name);
                    return message.reply(`Merci de commencer par créer ta fiche avec la commande ${prefix}fiche !`)
                }
                if(args.length !== 1) {
                    cd.deleteTimer(message.author.id, this.name);
                    return message.reply(`Mauvaise utilisation de la commande ! Tu peux créer une mutation avec la commande \`${prefix}mutate\` suivi du nom de la mutation (lise des mutations disponibles avec la commande \`${prefix}craft\`.`)
                }

                let isMutationAvailable = false;
                let desiredMutation = args[0].toLowerCase();
                mutations.map(mutation => {
                    if(desiredMutation === mutation.name) {
                        desiredMutation = mutation;
                        return isMutationAvailable = true;
                    }
                });
                if(!isMutationAvailable) {
                    cd.deleteTimer(message.author.id, this.name);
                    return message.reply("Désolé mais je ne vois pas quelle mutation tu veux appliquer...");
                }
                if(player.playerPurse < desiredMutation.price){
                    cd.deleteTimer(message.author.id, this.name);
                    return message.reply(`Désolé mais tu n'as pas assez de ${currency}...`);
                }

                let playerGetAllTheNecessaryMaterials = [];
                for(let [material, quantity] of Object.entries(desiredMutation.componentAndQuantityRequired)) {
                    playerGetAllTheNecessaryMaterials.push(thisPlayerHasThisMaterial(player, material, true, quantity));
                }
                const everyValueIsTrue = value => value === true;
                if(!playerGetAllTheNecessaryMaterials.every(everyValueIsTrue)){
                    cd.deleteTimer(message.author.id, this.name);
                    return message.reply("Désolé mais tu ne possèdes pas tous les matériaux requis...");
                }
                //Every tests is checked, we can now apply the mutation to the player!
                player.playerPurse -= desiredMutation.price;
                for(let [material, quantity] of Object.entries(desiredMutation.componentAndQuantityRequired)) {
                    for(let i = 1; i <= quantity; i++) {
                        player.playerMaterials.splice(player.playerMaterials.indexOf(material), 1);
                    }
                }
                const newMultiplier = mutationManager.getNewMutationMultiplier(desiredMutation);
                player.playerMutations.push(`${desiredMutation.name}x${newMultiplier}`);
                const experience = expManager.addExperience(player, maxExperience, message);
                player.save()
                    .then(message.channel.send(`Après avoir enduré de nombreuses souffrances, l'ADN de <@${player.playerId}> a muté !`))
                    .then(message.reply(desiredMutation.whenCrafted))
                    .then(message.channel.send(`Le corps de <@${player.playerId}> a imprégné la puissance de \`${desiredMutation.icon} ${desiredMutation.name}\` avec un multiplicateur de **${newMultiplier}** (maximum : ${desiredMutation.maxMultiplier}) !`))
                    .then(message.channel.send(`La puissance de <@${player.playerId}> a été augmentée de **${desiredMutation.basicPower*newMultiplier}** \`${powerFormat}\` (\`+${experience}\` ${experienceFormat}) !`));
            })
    }
};