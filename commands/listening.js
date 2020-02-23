module.exports = {
    name: 'listening',
    description: '',
    creatorOnly: true,
    cooldown: 60,
    execute(message, args) {
        process.env.BOT_TOKEN ?
            message.channel.send('Listening from heroku server.')
            : message.channel.send('Listening from local PC.');
    }
};