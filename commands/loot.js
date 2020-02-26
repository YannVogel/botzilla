const PlayerSheet = require('../models/playerSheet');
const {prefix} = require('../config');
const random = require('./dependencies/_getRandomInt');
const randomMoney = require('./dependencies/_getRandomMoney');
const {currency} = require('../config');
const Discord = require('discord.js');
const cooldowns = require('../bot/events/onMessage').cooldowns;

module.exports = {
    name: 'loot',
    description: `Essayez de gagner le plus de ${currency} possible !!`,
    guildOnly: true,
    cooldown: 60*30,
    execute(message) {
        PlayerSheet.findOne({playerId: message.author.id})
            .then(player => {
                if(!player) {
                    const timestamps = cooldowns.get(this.name);
                    // Delete the CD of this command for an user with no sheet created yet
                    timestamps.delete(message.author.id);
                    return message.reply(`Merci de commencer par créer ta fiche avec la commande ${prefix}fiche !`)
                }
                this.cooldown = 60*30;
                const rng = random.getRandomInt(100) + 1;

                return randomMoney.getRandomMoney(rng, message);
            })
    }
};