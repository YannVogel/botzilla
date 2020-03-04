const random = require('./_getRandomInt');
const levelManager = require('./_getPlayerLevel');
const staminaManager = require('./_getPlayerStamina');

module.exports = {
    addExperience: (player, maxExperience, message) => {
        const oldExperience = player.playerExperience;
        const wonExperience = random.getRandomInt(maxExperience) +1;
        const newExperience = oldExperience + wonExperience;
        player.playerExperience += wonExperience;
        if(levelManager.getPlayerLevel(player, oldExperience) < levelManager.getPlayerLevel(player, newExperience))
        {
            message.channel.send(`:arrow_double_up: **﻿LEVEL UP** :arrow_double_up:﻿ <@${player.playerId}> est monté(e) de niveau ! Son endurance a été restaurée !`)
            player.playerMaxStamina = staminaManager.getPlayerMaxStamina(player);
            player.playerStamina = player.playerMaxStamina;
            player.save();
            return wonExperience
        }
        player.save();
        return wonExperience
    }
};