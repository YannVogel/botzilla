const RoleMessages = require('../models/roleMessages');

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

        const role = message.guild.roles.cache.find(role => role.name === roleToFind);
        if (!role) {
            return message.reply(`Je n'ai pas trouvé le rôle \`${roleToFind}\`...`);
        }
        const reactEmoji = message.guild.emojis.cache.find(emoji => emoji.id === emojiId);
        if(!reactEmoji) return message.channel.send("Il faut préciser un emoji propre au serveur !");

        message.channel.send(`Merci de réagir avec ${emoji} si vous souhaitez avoir le rôle \`${role.name}\` !`)
            .then(message => {
                message.react(reactEmoji).catch(console.error);

                const filter = reaction => reaction.emoji.name === reactEmoji.name;
                const collector = message.createReactionCollector(filter);

                collector.on('collect', reaction => {
                    reaction.users.cache.forEach(user => {
                        message.guild.members.cache.forEach(member => {
                            if (user.id === member.id) {
                                member.roles.add(role).catch(console.error);
                            }
                        });
                    });
                });
                const roleData = new RoleMessages({
                    guildId: message.guild.id,
                    guildName: message.guild.name,
                    roleId: role.id,
                    roleName: role.name,
                    messageId: message.id,
                });
                roleData.save()
                    .catch(error =>
                        console.error(`Une erreur est survenue lors de l'engesitrement de ${role.name} sur le serveur ${message.guild.name} : ${error}`)
                    );
            }).catch(console.error);
    }
};

