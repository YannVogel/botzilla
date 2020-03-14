const rng = require('./_getRandomInt');

module.exports = {
    getNewMutationMultiplier: mutation => {
        return rng.getRandomInt(mutation.maxMultiplier) + 1;
    }
};