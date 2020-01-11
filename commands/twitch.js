const TwitchClient  = require('twitch').default;
const clientId = 'jqbsd8vxhjy2cgeyd4le9w19syobgp';
const clientSecret  = 'ny33x86oxolgclzzvfzz8fhgjdhynr';
const twitch = TwitchClient.withClientCredentials(clientId, clientSecret);

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
    adminOnly: false,
    cooldown: 5,
    execute(message, args) {
        let research = args.join('_');
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