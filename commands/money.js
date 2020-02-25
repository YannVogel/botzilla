const currency = 'bobzi$$';
const getMoney = require('./dependencies/_getPlayerMoney');

module.exports = {
    name: 'money',
    description: `Renseigne un joueur sur le nombre de ${currency} dont il dispose.`,
    cooldown: 60,
    execute(message) {
        return getMoney.getPlayerMoney(message);
    }
};