const TwitchClient  = require('twitch').default;
const {twitchClientID}  = process.env.TWITCH_ID || require('../../auth.json');
const {twitchClientSecret} = process.env.TWITCH_SECRET || require('../../auth.json');
const twitch = TwitchClient.withClientCredentials(process.env.TWITCH_ID || twitchClientID,
    process.env.TWITCH_SECRET || twitchClientSecret);
const missingChannelMessage = require('../_missingChannelMessage');
const streamer = 'bobzilla4tv';
const streamLink = 'https://www.twitch.tv/' + streamer;
// Permet de ne pas spammer un chan quand un streamer est en live, le but étant de n'avetir qu'une seule fois
let firstNotification = true;
const {adminID} = process.env.ADMIN_ID || require('../../auth.json');

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
                        botClient.guilds.cache.forEach(guild => {
                            const channel = guild.channels.cache.find(ch => ch.name === channelName);
                            firstNotification = false;

                            // If the channel doesn't exist, contacts the server owner
                            if(!channel) {
                                const adminMember = guild.members.cache.find(member => member.id === (process.env.ADMIN_ID || adminID));
                                return adminMember.send(missingChannelMessage(guild.name, channelName));
                            }
                            return channel.send(`Hey ! ${streamer} a commencé son live ! Rendez-vous sur sa chaîne : ${streamLink} !`);
                        });
                    }
                } else {
                    firstNotification = true;
                }
            });
    }, 1000 * timeInSeconds);
};