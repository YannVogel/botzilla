/**
 * @class
 * @property {Number} id
 * @property {String} name
 * @property {String} icon
 * @property {Number} basicPower
 * @property {Number} maxMultiplier
 * @property {Object} componentAndQuantityRequired
 * @property {String} whenCrafted
 */
const mutations = require('./mutations').mutations;
const powerManager = require('./_getPlayerTotalPower');
const {powerFormat} = require('../../gameConfig');

module.exports = {
    getFormattedPlayerMutations: (player, mutationsInventory) => {
        if(mutationsInventory.length === 0) {
            return "Aucune mutation acquise.";
        }
        let mutationsList = '';
        mutations.map(mappedMutation => {
            mutationsInventory.forEach(mutation => {
                const mutationName = mutation.split('x')[0];
                const mutationMultiplier = mutation.split('x')[1];
                if(mutationName === mappedMutation.name){
                    mutationsList += `**${mappedMutation.icon}** ${mappedMutation.name} **x${mutationMultiplier}** | `;
                }
            });
        });
        return `possède les mutations suivantes :\n${mutationsList.replace(/ \| $/, '')}.\nPour un total de \`${powerManager.getPlayerTotalPower(player)} ${powerFormat}\`.`;
    }
};