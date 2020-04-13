const Discord = require('discord.js');
const cooldowns = new Discord.Collection();
const {prefix} = require('../../config');
const {adminID} = process.env.ADMIN_ID || require('../../auth.json');
const {devID} = process.env.DEV_ID || require('../../auth.json');
const {devServerID} = process.env.DEV_SERVER_ID || require('../../auth');
const fs = require('fs');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const formatted = require('../../commands/dependencies/_getFormattedCooldown');
const {getRandomInt} = require('../../commands/dependencies/_getRandomInt');

const frenchSynonymForHello = [
    'bonjour', 'salut', 'hello', 'yo', 'iop', 'coucou', 'kikou', 'hey', 'bijour', 'io', 'cc', 'koukou', 'wesh',
    'chalut', 'slt', 'yop'
];

const emojiForHello = [
    ':wave:', ':person_raising_hand:', ':yawning_face:', ':kissing:', ':wink:', ':blush:', ':smile:', ':grin:',
    ':smiley:', ':laughing:', ':wink:', ':yum:', ':star_struck:', ':heart_eyes:', ':kissing_heart:',
    ':smiling_face_with_3_hearts:'
];

module.exports =
        {
            cooldowns,
            onMessage: botClient => {

    botClient.commands = new Discord.Collection();
    for (const file of commandFiles) {
        const command = require(`../../commands/${file}`);
        botClient.commands.set(command.name, command);
    }

    botClient.on('message', message => {
        if(!message.author.bot){
            for(let i = 0; i < frenchSynonymForHello.length; i++) {
                const regex = new RegExp(`( |^)${frenchSynonymForHello[i]}( |$)`, "gi");

                if(regex.test(message.toString())) {
                    let helloArray = frenchSynonymForHello[getRandomInt(frenchSynonymForHello.length)].split('');
                    helloArray[0] = helloArray[0].toUpperCase();
                    const stringAnswer = helloArray.join('');
                    message.channel.send(`${stringAnswer} ${message.author.username} ! ${emojiForHello[getRandomInt(emojiForHello.length)]}`);
                    break;
                }
            }
        }

        // If a message doesn't start by the prefix or is from a bot , stops the function
        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = botClient.commands.get(commandName)
            || botClient.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return;
        // If the bot is in dev mode and the server is not the admin server
        if(!process.env.BOT_TOKEN && message.guild.id !== devServerID) return;

        // Blocks a guild only command if used in a private message
        if (command.guildOnly && message.channel.type !== 'text') {
            return message.reply('Je ne peux pas utiliser cette commande dans les messages privés !');
        }
        // Blocks a message manager only command if used by a user with not enough permission
        if (command.messageManagerOnly && !message.member.hasPermission('MANAGE_MESSAGES')) {
            return message.reply('**Permissions insuffisantes !**');
        }
        // Blocks a member manager only command if used by a user with not enough permission
        if (command.memberManagerOnly && !message.member.hasPermission('KICK_MEMBERS')) {
            return message.reply('**Permissions insuffisantes !**');
        }
        // Blocks a role manager only command if used by a user with not enough permission
        if (command.roleManagerOnly && !message.member.hasPermission('MANAGE_ROLES')) {
            return message.reply('**Permissions insuffisantes !**');
        }
        // Blocks a creator only command if used by a non-creator user
        if (command.creatorOnly && message.author.id !== (process.env.ADMIN_ID || adminID)) {
            console.log(`Commande "${command.name}" a été bloquée : réclamée par ${message.author.username} sur le serveur ${message.guild}.`);
            return message.reply('Désolé mais cette commande est réservée à l\'administration du bot.');
        }
        // If necessary arguments for a command are not indicated...
        if (command.args && !args.length) {
            let reply = `Tu n'as précisé aucun argument, ${message.author}!`;
            // ...displays the correct syntax of the command
            if (command.usage) {
                reply += `\nLa bonne syntaxe est : \`${prefix}${command.name} ${command.usage}\``;
            }

            return message.channel.send(reply);
        }

        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Discord.Collection());
        }
        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 3) * 1000;

        if (timestamps.has(message.author.id)) {

            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.reply(`Merci d'attendre encore \`${formatted.getFormattedCooldown(timeLeft.toFixed(0))}\` avant d'utiliser la commande \`${command.name}\` de nouveau.`);
            }
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

        try {
            command.execute(message, args);
            return console.log(`Commande "${command.name}" réussie : réclamée par ${message.author.username} sur le serveur ${message.guild}.`);
        } catch (error) {
            console.log(`Commande "${command.name}" a retourné une erreur : réclamée par ${message.author.username} sur le serveur ${message.guild}.`);
            console.error(error);
            return message.reply('Une erreur s\'est produite lors de l\'exécution de cette commande');
        }
    });
        }
};