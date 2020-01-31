function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

module.exports = {
    name: 'roll',
    aliases: ['rl'],
    description: 'Jette un dé du nombre de faces demandées (ou un dé 6 par défaut)',
    args: false,
    usage: '<nombre de faces>',
    guildOnly: false,
    adminOnly: false,
    cooldown: 0,
    execute(message, args) {
        if(args[0] && isNaN(args[0])) {
            return message.channel.send(`Désolé mais "${args[0]}" n'est pas un nombre...`);
        }
        if(!args[0]) { args[0] = 6}

        return message.reply(`jette un dé ${args[0]} et obtient \`${getRandomInt(args[0]) + 1}\``);
    }
};