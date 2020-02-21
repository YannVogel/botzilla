// Contains the message to display if a server where the bot is doesn't have the correct text channel or if the bot
// doesn't have the permissions to write in it
module.exports = (serverName, missingChannelName) => {
    return `Je n'ai pas trouvé de chan ${missingChannelName} sur le serveur ${serverName}` ;
};