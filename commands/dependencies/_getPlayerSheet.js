const Discord = require("discord.js");
const PlayerSheet = require('../../models/playerSheet');
const {currency} = require('../../config');
const frDate = require('./_getFrenchDate');

module.exports = {
    getPlayerSheet: function(member) {
        return new Promise(resolve =>{
            PlayerSheet.findOne({playerId: member.id})
                .then(player => {
                    // If this player doesn't have a sheet in the DB...
                    if (!player) {
                         player = new PlayerSheet({
                            playerId: member.id,
                            playerName: member.username,
                            playerExperience: 0,
                            playerPurse: 0,
                            playerInventory: [],
                            createdAt: new Date(),
                            playerRuby: 0,
                            playerCurses: 0
                        });
                        // ...creates the player sheet in the DB
                        player.save().catch(console.error);
                    }

                    resolve(
                        new Discord.MessageEmbed()
                            .setColor('#ffffff')
                            .setTitle(player.playerName)
                            .setDescription(`Fiche créée le ${frDate.getFrenchDate(player.createdAt)}`)
                            .addField("Expérience", player.playerExperience, true)
                            .addField("Inventaire", `${player.playerInventory.length} objet${player.playerInventory.length > 1 ? 's' : ''}`, true)
                            .addField(currency, player.playerPurse, true)
                            .addField('Rubis obtenus', player.playerRuby, true)
                            .addField('Malédictions', player.playerCurses, true)
                            .setThumbnail(member.avatarURL())
                    )
                });
        })
    }
};