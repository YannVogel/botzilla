const items = require('./gameMarket').item;

module.exports = {
    getFormattedPlayerInventory: inventory => {
        if(inventory.length > 0) {
            let formattedInventory = '';
            items.map(item => {
                let count = 0;
                for(let i = 0; i < inventory.length; i++) {
                    if(inventory[i] === item.name) {
                        count++;
                    }
                }
                if(count) {
                    formattedInventory+= count > 1 ? `${item.icon}${item.name} **x${count}** | ` : `${item.icon}${item.name} | `;
                }
            });

            return formattedInventory.replace(/ \| $/, '');
        }else {
            return "0 objet";
        }
    }
};