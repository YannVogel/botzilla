const cooldowns = require('../bot/events/onMessage').cooldowns;
const fs = require('fs');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const {prefix} = require('../config');
const formatted = require('./dependencies/_getFormattedCooldown');
const Discord = require('discord.js');

module.exports = {
    name: 'mycooldowns',
    aliases: ['mycd'],
    description: `Renseigne un joueur sur l'état de ses cooldowns actuels'`,
    guildOnly: true,
    cooldown: 1,
    execute(message) {
        let noActualCd = true;
        let embed = new Discord.MessageEmbed()
            .setTitle(`Cooldowns de ${message.author.username}`)
            .setThumbnail(message.author.avatarURL());
        for (let file of commandFiles) {
            const command = require(`./${file}`);
            const timestamps = cooldowns.get(command.name);
            if(timestamps && timestamps.has(message.author.id) && command.name !== this.name){
                    noActualCd = false;
                    const cooldownAmount = (command.cooldown || 3) * 1000;
                    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
                    const timeLeft = (expirationTime - Date.now()) / 1000;
                    embed.addField(`${prefix}${command.name}`, `${formatted.getFormattedCooldown(timeLeft.toFixed(0))}`, true)
            }
        }
        if(noActualCd) return message.reply(`Tu n'as aucun CD d'actif actuellement ! Bon jeu :smile:`);
        return message.reply(embed);
    }
};