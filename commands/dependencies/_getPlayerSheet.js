const Discord = require("discord.js");
const PlayerSheet = require('../../models/playerSheet');
const {currency} = require('../../config');
const frDate = require('./_getFrenchDate');
const format = require('./_getFormattedPlayerInventory');
const {experienceFormat} = require('../../gameConfig');
const playerLevelManager = require('./_getPlayerLevel');
const expBarManager = require('./_getExperienceBar');

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
                    const playerWinRate = ((player.wonChallenge / (player.wonChallenge + player.lostChallenge))*100).toFixed(2);
                    resolve(
                        new Discord.MessageEmbed()
                            .setColor('#ffffff')
                            .setTitle(`${player.playerName} (niveau ${playerLevelManager.getPlayerLevel(player)})\n${expBarManager.getExperienceBar(player).fragmentBar} \n(${expBarManager.getExperienceBar(player).actualPercent}%)`)
                            .setDescription(`Fiche créée le ${frDate.getFrenchDate(player.createdAt)}`)
                            .addField("Inventaire", format.getFormattedPlayerInventory(player.playerInventory))
                            .addField("Expérience", `${player.playerExperience} ${experienceFormat}`, true)
                            .addField(currency, player.playerPurse, true)
                            .addField('Rubis obtenus', `${player.playerRuby} :gem:`, true)
                            .addField('Malédictions', `${player.playerCurses} :skull:﻿`, true)
                            .addField('Défis lancés / acceptés / refusés', `${player.initiatedChallenge} :blue_circle: / ${player.acceptedChallenge} :green_circle: / ${player.refusedChallenge} :red_circle:`, true)
                            .addField('Défis gagnés/perdus', `${player.wonChallenge} :white_check_mark: / ${player.lostChallenge} :x:\n(wr : ${playerWinRate}%)`, true)
                            .setThumbnail(member.avatarURL())
                    );
                })
        });
    }
};