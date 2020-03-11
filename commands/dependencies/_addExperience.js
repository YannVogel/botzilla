const random = require('./_getRandomInt');
const levelManager = require('./_getPlayerLevel');
const staminaManager = require('./_getPlayerStamina');

module.exports = {
    /* THIS FUNCTION DOESN'T SAVE THE PLAYER (anymore)! DON'T FORGET TO USE PLAYER.SAVE() IN THE CODE USING THIS FUNCTION!! */
    addExperience: (player, maxExperience, message) => {
        const oldExperience = player.playerExperience;
        const wonExperience = random.getRandomInt(maxExperience) +1;
        const newExperience = oldExperience + wonExperience;
        player.playerExperience += wonExperience;
        if(levelManager.getPlayerLevel(player, oldExperience) < levelManager.getPlayerLevel(player, newExperience))
        {
            message.channel.send(`🔼🆙 **﻿LEVEL UP** 🔼🆙﻿ <@${player.playerId}> est monté(e) de niveau ! Son endurance a été restaurée !`);
            player.playerMaxStamina = staminaManager.getPlayerMaxStamina(player);
            player.playerStamina = player.playerMaxStamina;
            return wonExperience
        }
        return wonExperience
    }
};