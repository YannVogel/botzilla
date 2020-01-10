module.exports = {
    name: 'test',
    description: '',
    args: false,
    usage: '',
    guildOnly: true,
    adminOnly: true,
    cooldown: 60,
    execute(message, args) {

        return message.channel.send(`Commande de test réclamée par ${message.author}!`);
    }
};