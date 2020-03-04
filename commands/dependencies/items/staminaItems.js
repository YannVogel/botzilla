module.exports = {
    useStaminaItem: (player, itemName) => {
        switch(itemName) {
            case 'salad':
                player.playerStamina += 5;
                if(player.playerStamina > player.playerMaxStamina) player.playerStamina = player.playerMaxStamina;
                player.save();
            break;
            case 'onigiri':
                player.playerStamina += 10;
                if(player.playerStamina > player.playerMaxStamina) player.playerStamina = player.playerMaxStamina;
                player.save();
                break;
            case 'coffee':
                player.playerStamina += 20;
                if(player.playerStamina > player.playerMaxStamina) player.playerStamina = player.playerMaxStamina;
                player.save();
            break;
            case 'ramen':
                player.playerStamina += 40;
                if(player.playerStamina > player.playerMaxStamina) player.playerStamina = player.playerMaxStamina;
                player.save();
            break;
            default:
            break;
        }
    }
};
