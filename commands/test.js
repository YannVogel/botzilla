const axios = require('axios');

module.exports = {
    name: 'test',
    description: '',
    args: false,
    usage: '',
    guildOnly: true,
    adminOnly: true,
    cooldown: 60,
    execute(message, args) {

        axios.get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY')
            .then(response => {
                message.channel.send(response.data.url);
                message.channel.send(response.data.explanation);
            })
            .catch(error => {
                console.log(error);
            });
    }
};