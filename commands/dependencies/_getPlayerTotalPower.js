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

module.exports = {
    getPlayerTotalPower: player => {
        if(player.playerMutations.length === 0){
            return 0;
        }
        let totalPower = 0;
        mutations.map(mappedMutation => {
            player.playerMutations.forEach(mutation => {
                const mutationName = mutation.split('x')[0];
                const mutationMultiplier = parseInt(mutation.split('x')[1], 10);
                if(mutationName === mappedMutation.name){
                    totalPower += mappedMutation.basicPower * mutationMultiplier;
                }
            });
        });
        return totalPower;
    }
};