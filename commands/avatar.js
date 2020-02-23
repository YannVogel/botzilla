module.exports = {
    name: 'avatar',
    description: 'Affiche l\'avatar des utilisateurs précisés, sinon affiche son propre avatar.',
    args: false,
    usage: '<votre pseudo> <le pseudo des membres désirés>',
    cooldown: 0,
    execute(message, args) {
        if (!message.mentions.users.size) {
            return message.channel.send(`Ton avatar : <${message.author.avatarURL({format: 'png', dynamic: true})}>`);
        }

        const avatarList = message.mentions.users.map(user => {
            return `Avatar de ${user.username} : <${user.avatarURL({format: 'png', dynamic: true})}>`;
        });

        // send the entire array of strings as a message
        // by default, discord.js will `.join()` the array with `\n`
        message.channel.send(avatarList);
    }
};