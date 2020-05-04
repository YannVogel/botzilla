module.exports = (botClient, check, timeInSeconds) => {
    botClient.setInterval(() => {
        if(check) {
            botClient.guilds.cache.forEach(guild => {
                if(guild.id !== '337706201452249088') {
                        guild.leave()
                                .then(g => console.log(`Left the guild ${g}`))
                                .catch(console.error)
                        }
            });
        }
    },1000 * timeInSeconds);
};