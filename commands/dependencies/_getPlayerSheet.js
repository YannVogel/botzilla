const Discord = require("discord.js");
const PlayerSheet = require('../../models/playerSheet');
const currency = 'bobzi$$';

const daysFr = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
];

const monthsFr = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre"
];

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
                            createdAt: new Date()
                        });
                        // ...creates the player sheet in the DB
                        player.save().catch(console.error);
                    }

                    const dayFr = daysFr[player.createdAt.getDay()];
                    const dayNumber = player.createdAt.getDate();
                    const monthFr = monthsFr[player.createdAt.getMonth()];
                    const year = player.createdAt.getFullYear();

                    const dateFr = `${dayFr} ${dayNumber} ${monthFr} ${year}`;

                    resolve(
                        new Discord.MessageEmbed()
                            .setColor('#ffffff')
                            .setTitle(player.playerName)
                            .setDescription(`Fiche créée le ${dateFr}`)
                            .addField("Expérience", player.playerExperience, true)
                            .addField("Inventaire", `${player.playerInventory.length} objet${player.playerInventory.length > 1 ? 's' : ''}`, true)
                            .addField(currency, player.playerPurse, true)
                            .setThumbnail(member.avatarURL())
                    )
                });
        })
    }
};