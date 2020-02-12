const TwitchClient  = require('twitch').default;
const {twitchClientID}  = process.env.TWITCH_ID || require('../auth.json');
const {twitchClientSecret} = process.env.TWITCH_SECRET || require('../auth.json');

const twitch = TwitchClient.withClientCredentials(process.env.TWITCH_ID || twitchClientID,
    process.env.TWITCH_SECRET || twitchClientSecret);

async function isStreamLive(userName) {
    const user = await twitch.helix.users.getUserByName(userName);
    if (!user) {
        return false;
    }
    return await twitch.helix.streams.getStreamByUserId(user.id) !== null;
}

module.exports = {
    name: 'twitch',
    description: 'Vérifie si un streamer est en live sur Twitch.',
    args: true,
    usage: '[streamer_name]',
    guildOnly: false,
    moderatorOnly: false,
    creatorOnly: false,
    cooldown: 5,
    execute(message, args) {
        const research = args.join('_');
        isStreamLive(research)
            .then((isLive) => {
                if (isLive) {
                    return message.reply( ":green_circle:`"+research+" est en stream !`:green_circle:\n" +
                        "https://www.twitch.tv/"+research);
                } else {
                    return message.reply(":red_circle:`"+research+" ne stream pas actuellement.`:red_circle:")
                }
            });
    }
};