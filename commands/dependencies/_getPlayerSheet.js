const Discord = require("discord.js");
const PlayerSheet = require('../../models/playerSheet');
const {currency} = require('../../config');
const frDate = require('./_getFrenchDate');
const format = require('./_getFormattedPlayerInventory');
const {experienceFormat} = require('../../gameConfig');
const playerLevelManager = require('./_getPlayerLevel');
const expBarManager = require('./_getExperienceBar');
const staminaManager = require('./_getPlayerStamina');
const numberManager = require('./_getFormattedNumber');
const buffManager = require('./_buffManager');
const {getPlayerTotalPower} = require('./_getPlayerTotalPower');
const {powerFormat} = require('../../gameConfig');
const {getFormattedPlayerMutations} = require('./_getFormattedPlayerMutations');

module.exports = {
    getPlayerSheet: function(member, isAskedFromAdminCommand = false) {
        return new Promise(resolve =>{
            PlayerSheet.findOne({playerId: member.id})
                .then(player => {
                    // If this member doesn't have a sheet in the DB and the command is asked from the !admin command, stops the function...
                    // The !admin command is used to view a player sheet, not to create a new one!
                    if(!player && isAskedFromAdminCommand) {
                        resolve(`Ce joueur ne fait pas encore partie du jeu !`) ;
                    }
                    // If this member doesn't have a sheet in the DB, creates one...
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
                        // save() is unnecessary here since player will be saved line 35 with getPlayerStamina.
                        /*player.save().catch(console.error);*/
                    }
                    const totalPlayerChallenges = player.wonChallenge + player.lostChallenge;
                    const playerWinRate = totalPlayerChallenges > 0 ? ((player.wonChallenge / (totalPlayerChallenges))*100).toFixed(2) : '--';
                    const playerStamina = staminaManager.getPlayerStamina(player);
                    const playerMaxStamina = staminaManager.getPlayerMaxStamina(player);
                    resolve(
                        new Discord.MessageEmbed()
                            .setColor('#ffffff')
                            .setTitle(`${player.playerName} (niveau ${playerLevelManager.getPlayerLevel(player)})\n${expBarManager.getExperienceBar(player).fragmentBar} \n(${expBarManager.getExperienceBar(player).actualPercent}%)`)
                            .setDescription(`Fiche créée le ${frDate.getFrenchDate(player.createdAt)}`)
                            .addField(`Puissance (${getPlayerTotalPower(player)} ${powerFormat})`, getFormattedPlayerMutations(player))
                            .addField("Inventaire", format.getFormattedPlayerInventory(player.playerInventory))
                            .addField("Matériaux", format.getFormattedPlayerInventory(player.playerMaterials, true))
                            .addField("Expérience", `${numberManager.getFormattedNumber(player.playerExperience)} ${experienceFormat}`, true)
                            .addField("Endurance", (playerStamina === playerMaxStamina ? `**${playerStamina}/${playerMaxStamina}**` : `${playerStamina}/${playerMaxStamina}`), true)
                            .addField(currency, player.playerPurse, true)
                            .addField(`Bonus (+${buffManager.getPlayerTotalBuff(player)}%)`, format.getFormattedPlayerInventory(player.playerBuff, false, true), true)
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