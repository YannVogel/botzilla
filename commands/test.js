const axios = require('axios');

module.exports = {
    name: 'test',
    description: '',
    args: false,
    usage: '',
    guildOnly: true,
    moderatorOnly: false,
    creatorOnly: true,
    cooldown: 60,
    execute(message, args) {

        /*const AuthStr = 'Authorization: OAuth '.concat(USER_TOKEN);
        const URL = '';

        axios.get(URL, { headers: { Authorization: AuthStr } }).then(response => {
            // If request is good...
            console.log(response.data);
        })
            .catch((error) => {
                console.log('error 3 ' + error);
            });
    }*/
        return message.channel.send("Commande non disponible actuellement...");
    }
};