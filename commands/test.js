module.exports = {
    name: 'test',
    description: '',
    args: false,
    usage: '',
    guildOnly: true,
    cooldown: 60,
    execute(message, args) {

        console.log(`Commande de test réclamée par ${message.author.username}!`)
        return message.channel.send(`Commande de test réclamée par ${message.author}!`);
    }
};