const levelManager = require('./_getPlayerLevel');

const obtainedFragmentBar = '▫';
const notObtainedFragmentBar = '﻿▪';
const numberOfFragments = 20;     // The exp bar is divided by 'numberOfFragments' fragments

module.exports = {
    getExperienceBar: (player) => {
        const playerLevel = levelManager.getPlayerLevel(player);
        const requiredExperienceForLevelUp = levelManager.requiredExperience(playerLevel+1);
        const actualPercent = (((player.playerExperience - levelManager.requiredExperience(playerLevel))*100)/(requiredExperienceForLevelUp - levelManager.requiredExperience(playerLevel))).toFixed(1);
        let experienceBar = '';
        for(let i = 1; i <= numberOfFragments; i++){
            if(actualPercent >= (i*(100/numberOfFragments))) {
                experienceBar += obtainedFragmentBar;
            }else {
                experienceBar += notObtainedFragmentBar;
            }
        }

        return {
            fragmentBar: experienceBar,
            actualPercent: actualPercent
        }
    }
};