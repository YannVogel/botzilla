const RoleMessages = require('../../models/roleMessages');

module.exports = (botClient) => {
    botClient.on('messageReactionAdd', async (reaction, user) => {
        // When we receive a reaction we check if the message is partial or not
        if (reaction.message.partial) {
            // If the message was removed the fetching might result in an API error, which we need to handle
            try {
                await reaction.message.fetch();
            } catch (error) {
                console.log('Something went wrong when fetching the message: ', error);
            }
        }
        // Now the message has been cached and is fully available
        RoleMessages.findOne({guildId: reaction.message.guild.id, messageId: reaction.message.id})
            .then(messageToReact => {
                if(!messageToReact) return;
                const member = reaction.message.guild.members.cache.find(member => member.id === user.id);
                if(!member) return;
                const role = reaction.message.guild.roles.cache.find(role => role.id === messageToReact.roleId);
                if (!role) return;
                member.roles.add(role).catch(console.error);
                console.log(`${member} a réagi sur le serveur ${messageToReact.guildName} et a maintenant le rôle ${messageToReact.roleName}`);
            });
        // We can also check if the reaction is partial or not
        if (reaction.partial) {
            try {
                await reaction.fetch();
            } catch (error) {
                console.log('Something went wrong when fetching the reaction: ', error);
            }
        }
        // Now the reaction is fully available and the properties will be reflected accurately:
        /*console.log(`${reaction.count} user(s) have given the same reaction to this message!`);*/
    });
};