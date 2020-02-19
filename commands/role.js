module.exports = {
    name: 'role',
    description: "Affiche un message permettant d'attribuer un rôle aux utilisateurs suivant leur réaction",
    args: true,
    usage: '<\`nom du rôle\`> <\`emoji de réaction\`>',
    guildOnly: true,
    roleManagerOnly: true,
    creatorOnly: false,
    cooldown: 0,
    execute(message, args) {
        if (args.length !== 2) {
            return message.reply("Mauvaise utilisation de la commande...")
                .then(message.reply(`Tu peux utiliser \`bz!help role\` pour obtenir plus d'informations !`))
        }
        const roleToFind = args[0];
        const emoji = args[1];
        const emojiId = emoji.replace(/[a-z]|<|>|:/gi, '');

        const role = message.guild.roles.find(role => role.name === roleToFind);
        if (!role) {
            return message.reply(`Je n'ai pas trouvé le rôle \`${roleToFind}\`...`);
        }
        const reactEmoji = message.guild.emojis.find(emoji => emoji.id === emojiId);
        if(!reactEmoji) return message.channel.send("Il faut préciser un emoji propre au serveur !");

        message.channel.send(`Merci de réagir avec ${emoji} si vous souhaitez avoir le rôle \`${role.name}\` !`)
            .then(message => {
                message.react(reactEmoji).catch(console.error);

                const filter = reaction => reaction.emoji.name === reactEmoji.name;
                const collector = message.createReactionCollector(filter);

                collector.on('collect', reaction => {
                    reaction.users.forEach(user => {
                        message.guild.members.forEach(member => {
                            if (user.id === member.id) {
                                member.addRole(role).catch(console.error);
                            }
                        });
                    });
                });
            }).catch(console.error);
    }
};

