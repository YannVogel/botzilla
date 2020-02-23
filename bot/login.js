const {token} = process.env.BOT_TOKEN || require('../auth.json');
const {version} = require('../package');

module.exports = botClient => {
    return botClient.login(process.env.BOT_TOKEN || token)
        .then(() => {
            console.log('botZilla is ready to go!');
            console.log(`Version du bot : ${version}`);
            process.env.BOT_TOKEN ?
                console.log('Currently listening from heroku server!') :
                console.log('Currently listening from local host!');
        })
        .catch(console.error);
};