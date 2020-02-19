module.exports = {
    name: 'test',
    description: '',
    args: false,
    usage: '[dlc] <game>',
    guildOnly: false,
    moderatorOnly: false,
    creatorOnly: true,
    cooldown: 0,
    execute(message, args) {
        return message.channel.send("Rien à afficher pour le moment...");
    }
};