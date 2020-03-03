const levelManager = require('./_getPlayerLevel');

const obtainedFragmentBar = '⬜﻿';
const notObtainedFragmentBar = '﻿⬛';

module.exports = {
    getExperienceBar: (player) => {
        const playerLevel = levelManager.getPlayerLevel(player);
        const requiredExperienceForLevelUp = levelManager.requiredExperience(playerLevel+1);
        const actualPercent = Math.round((player.playerExperience*100)/requiredExperienceForLevelUp);
        let experienceBar = '';
        for(let i = 1; i <= 10; i++){
            if(actualPercent > (i*10)) {
                experienceBar += obtainedFragmentBar;
            }else {
                experienceBar += notObtainedFragmentBar + '|';
            }
        }

        return {
            fragmentBar: experienceBar,
            actualPercent: actualPercent
        }
    }
};