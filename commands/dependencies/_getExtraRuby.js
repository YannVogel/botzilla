const random = require('./_getRandomInt.js');
const Discord = require('discord.js');
const {currency} = require('../../config');
const PlayerSheet = require('../../models/playerSheet');
const oneChanceInToGetRuby = 48;     // 1 chance in x to get a ruby
const minRubyValue = 100;
const maxRubyValue = 501 - minRubyValue;    // max = 500

const ruby = {
    'color': '#ad1500',
    'image': 'https://i.ibb.co/JrVvJwm/rubis.png',
};

module.exports = {
    getExtraRuby: function() {
        const rng = random.getRandomInt(oneChanceInToGetRuby);

        return rng === 24;
    },

    getRubyValue: function () {
        return random.getRandomInt(maxRubyValue) + minRubyValue;
    },

    getRuby: function (value) {
        return new Discord.MessageEmbed()
            .setColor(ruby['color'])
            .setThumbnail(ruby['image'])
            .addField(`Valeur du rubis`, `${value} ${currency}`)
    },

    rubyManager: function (player, message) {
        const rubyValue = this.getRubyValue();
        message.channel.send(`Le sac trouvé par <@${player.playerId}> contenait un rubis !`)
            .then(message.channel.send(this.getRuby(rubyValue)));

            player.playerPurse += rubyValue;
            player.playerRuby++;
            player.save();

    }
};