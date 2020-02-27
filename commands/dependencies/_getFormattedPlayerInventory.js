module.exports = {
    getFormattedPlayerInventory: inventory => {
        if(inventory.length > 0) {
            let formattedInventory = '';
            for(let i = 0; i < inventory.length; i++) {
                formattedInventory += `${inventory[i]} `;
            }
            return formattedInventory;
        }else {
            return "0 objet";
        }
    }
};