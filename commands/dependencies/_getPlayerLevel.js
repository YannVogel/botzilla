const levelMultiplier = 1.2;
const experienceRequiredForLevel2 = 500;
const maxLevel = 99;

const requiredExperience = level => {
    if(level === 1) return experienceRequiredForLevel2 - 1;
    let experienceRequired = experienceRequiredForLevel2;
    for(let i = 0; i < (level - 2); i++){
        experienceRequired *= levelMultiplier;
    }
    experienceRequired += experienceRequiredForLevel2*(level-2);
    return Math.round(experienceRequired);
};

module.exports = {
    // "experience" parameter is used to compare different experiences (useful when the player levels up)
    getPlayerLevel: (player, experience = 0 ) => {
        const pExperience = !experience ? player.playerExperience : experience;
        for(let i = 1; i<= maxLevel; i++) {
            if(pExperience < requiredExperience(i))
            {
                return i-1 <= 1 ? 1 : i-1;
            }
        }
        return 100;
    }
};