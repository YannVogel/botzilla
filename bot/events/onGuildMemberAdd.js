const missingChannelMessage = require('../_missingChannelMessage');

module.exports = (botClient, welcomeChannelName) => {
    botClient.on('guildMemberAdd', member => {
        botClient.guilds.forEach(guild => {
            const channel = guild.channels.find(ch => ch.name === welcomeChannelName);
            // If the channel doesn't exist, contacts the server owner
            if (!channel) {
                return guild.owner.user.send(missingChannelMessage(guild.name, welcomeChannelName));
            }
            // Displays a welcome message if the channel exists
            channel.send(`Bienvenue sur le serveur de la Bobzilla Family, ${member} !`);
        });
    });
};