const { prefix } = require('../config.json');

module.exports = {
    name: 'help',
    description: 'Liste des commandes disponibles',
    args: false,
    usage: '[command name]',
    guildOnly: false,
    moderatorOnly: false,
    creatorOnly: false,
    cooldown: 5,
    execute(message, args) {
        const data = [];
        const { commands } = message.client;
        if (!args.length) {
            data.push('Voici une liste des commandes de botZilla :');
            data.push('\n`');
            data.push(commands.map(command => command.creatorOnly ? '' : command.name).join(' - '));
            data.push('`\n');
            data.push(`Tu peux utiliser \`${prefix}help [nom d'une commande]\` pour avoir plus d'informations sur une commande !`);
            const answer = data.toString().replace(/,/g,' ')
                                            .replace(/` /g, '`')
                                                .replace(/- {2}-/g,'-')
                                                    .replace(/ - {2}`/, '`')
                                                        .replace(/ `/g, '`');

            return message.channel.send(answer)
                .then()
                .catch(error => {
                    console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                    message.reply('Je n\'ai pas réussi à t\'envoyer de DM... As-tu tes DMs désactivés ?');
                });
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply('Ce n\'est pas une commande valide !');
        }
        if(command.creatorOnly) { return; }

        data.push(`**Nom :** ${command.name}`);

        if (command.description) data.push(`**Description:** ${command.description}`);
        if (command.usage) data.push(`**Utilisation :** ${prefix}${command.name} ${command.usage}`);

        data.push(`**Cooldown :** ${command.cooldown || 1} seconde(s)`);

        message.channel.send(data, { split: true });
    },
};