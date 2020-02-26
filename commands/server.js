const Discord = require('discord.js');
const {botAvatar} = require('../config');
const frDate = require('./dependencies/_getFrenchDate');

function embedMessage(message){
    return new Discord.MessageEmbed()
        .setColor('#cfbb72')
        .setTitle(message.guild.name)
        .setAuthor(`Propriétaire : ${message.guild.owner.user.username}`, message.guild.owner.user.avatarURL())
        .setDescription(`Serveur créé le ${frDate.getFrenchDate(message.guild.createdAt)}`)
        .setThumbnail(botAvatar)
        .addField("Nombre de membres", message.guild.memberCount, true)
        .addField("Nombre d'emojis", message.guild.emojis.cache.size, true)
        .setImage(message.guild.iconURL() || message.guild.nameAcronym)
}

module.exports = {
    name: 'server',
    description: 'Affiche des informations sur le serveur',
    guildOnly: true,
    cooldown: 60,
    execute(message, args) {
        return message.channel.send(embedMessage(message));
    }
};