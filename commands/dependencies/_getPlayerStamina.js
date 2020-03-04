const baseStamina = 20;     //  The stamina a level 1 player has
const lvlManager = require('./_getPlayerLevel');

function getPlayerMaxStamina(player) {
    return baseStamina + lvlManager.getPlayerLevel(player) - 1;
}

module.exports = {
    getPlayerStamina: (player) => {
        // playerMaxStamina === 4444 means the player max stamina has not been calculated yet (4444 being the default value)
        if(player.playerMaxStamina === 4444) {
            player.playerMaxStamina = getPlayerMaxStamina(player);
            player.playerStamina = player.playerMaxStamina;
            player.save();
        }
        return player.playerStamina;
    },
    getPlayerMaxStamina
};