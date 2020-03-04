const random = require('./_getRandomInt');
const levelManager = require('./_getPlayerLevel');

module.exports = {
    addExperience: (player, maxExperience, message) => {
        const oldExperience = player.playerExperience;
        const wonExperience = random.getRandomInt(maxExperience) +1;
        const newExperience = oldExperience + wonExperience;
        if(levelManager.getPlayerLevel(player, oldExperience) < levelManager.getPlayerLevel(player, newExperience))
        {
            message.channel.send(`:arrow_double_up: **﻿LEVEL UP** :arrow_double_up:﻿ <@${player.playerId}> est monté(e) de niveau !`)
        }
        return wonExperience;
    }
};