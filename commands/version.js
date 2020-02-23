const {version} = require('../package');

module.exports = {
    name: 'version',
    description: 'Affiche la version du bot',
    creatorOnly: true,
    cooldown: 60,
    execute(message, args) {
        return message.channel.send("`Version actuelle de botZilla : " + version + "`");
    }
};