const TwitchClient  = require('twitch').default;
const {twitchClientID}  = process.env.TWITCH_ID || require('../../auth.json');
const {twitchClientSecret} = process.env.TWITCH_SECRET || require('../../auth.json');
const twitch = TwitchClient.withClientCredentials(process.env.TWITCH_ID || twitchClientID,
    process.env.TWITCH_SECRET || twitchClientSecret);
const streamer = 'bobzill4tv';
const streamLink = 'https://www.twitch.tv/' + streamer;
// Permet de ne pas spammer un chan quand un streamer est en live, le but étant de n'avetir qu'une seule fois
let firstNotification = true;

async function isStreamLive(userName) {
    const user = await twitch.helix.users.getUserByName(userName);
    if (!user) {
        return false;
    }
    return await twitch.helix.streams.getStreamByUserId(user.id) !== null;
}

module.exports = (botClient, timeInSeconds, channelName) => {
    botClient.setInterval(() => {
        isStreamLive(streamer)
            .then((isLive) => {
                if (isLive) {
                    if (firstNotification) {
                        botClient.guilds.forEach(guild => {
                            const channel = guild.channels.find(ch => ch.name === channelName);
                            firstNotification = false;

                            if (!channel) return;
                            return channel.send(`@here ${streamer} a commencé son live ! Rendez-vous sur sa chaîne : ${streamLink} !`);
                        });
                    }
                } else {
                    firstNotification = true;
                }
            });
    }, 1000 * timeInSeconds);
};