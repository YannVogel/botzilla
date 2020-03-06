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
    getFormattedPlayerInventory: (inventory, isMaterials = false) => {
        if(inventory.length > 0) {
            const library = !isMaterials ? items : materials;
            let formattedInventory = '';
            library.map(object => {
                let count = 0;
                for(let i = 0; i < inventory.length; i++) {
                    if(inventory[i] === object.name) {
                        count++;
                    }
                }
                if(count) {
                    formattedInventory+= count > 1 ? `${object.icon}${object.name} **x${count}** | ` : `${object.icon}${object.name} | `;
                }
            });
            return formattedInventory.replace(/ \| $/, '');
        }else {
            return `Aucun ${!isMaterials ? 'objet' : 'matériau'} possédé`;
        }
    }
};