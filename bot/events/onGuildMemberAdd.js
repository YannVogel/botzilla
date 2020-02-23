const missingChannelMessage = require('../_missingChannelMessage');
const {adminID} = process.env.ADMIN_ID || require('../../auth.json');

module.exports = (botClient, channelName) => {
    botClient.on('guildMemberAdd', member => {
        botClient.guilds.cache.forEach(guild => {
            const channel = guild.channels.cache.find(ch => ch.name === channelName);
            // If the channel doesn't exist, contacts the server owner
            if(!channel) {
                const adminMember = guild.members.cache.find(member => member.id === (process.env.ADMIN_ID || adminID));
                return adminMember.send(missingChannelMessage(guild.name, channelName));
            }
            // Displays a welcome message if the channel exists
            channel.send(`Bienvenue sur le serveur de la Bobzilla Family, ${member} !`);
        });
    });
};