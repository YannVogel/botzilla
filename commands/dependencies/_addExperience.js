const random = require('./_getRandomInt');

module.exports = {
    addExperience: maxExperience => {
        return random.getRandomInt(maxExperience) +1;
    }
};