const Discord = require('discord.js');
const rp = require('request-promise');
const cheerio = require('cheerio');
const {botAvatar} = require('../../config');
const EgsProms = require('../../models/egsProms');
const missingChannelMessage = require('../_missingChannelMessage');
const {adminID} = process.env.ADMIN_ID || require('../../auth.json');

module.exports = (botClient, timeInMinutes, channelName, roleToMention) => {
    botClient.setInterval(() => {
        const url = 'https://www.reddit.com/r/GameDeals/search?q=site:epicgames.com+OR+title:epicgamestore+OR+title:%22epic+game+store%22+OR+title:%22EGS%22+OR+title:%22epic+games%22&restrict_sr=on&sort=new&include_over_18=on&feature=legacy_search';
        rp(url)
            .then(html => {
                //success!
                const $ = cheerio.load(html);
                const lastNew = $('h3._eYtD2XCVieq6emjKBH3m', html).eq(0).text().split(/^\[[\w*\s?]*] /).join('');
                const newLink = 'https://www.reddit.com' + $('a.SQnoC3ObvgnGjWt90zD9Z._2INHSNB8V5eaWp4P0rY_mE', html).eq(0)[0].attribs.href;
                const imgThumb = $('div._2c1ElNxHftd8W_nZtcG9zf._33Pa96SGhFVpZeI6a7Y_Pl._2e9Lv1I3dOmICVO9fg3uTG', html).eq(0)[0].attribs.style.split('url(')[1].split(');')[0];
                const gameLink = $('a._13svhQIUZqD9PVzFcLwOKT.styled-outbound-link', html)[0].attribs.href.split('en-US').join('fr');

                EgsProms.findOne({title: lastNew})
                    .then(egsProms => {
                        // Si la promo existe déjà, on arrête tout
                        if (egsProms) return;

                        const newEgsProms = new EgsProms({
                            title: lastNew,
                            urlSource: newLink,
                            urlShop: gameLink,
                            image: imgThumb
                        });

                        // On ajoute la promo en nouvelle entrée de BDD
                        newEgsProms.save();

                        botClient.guilds.cache.forEach(guild => {
                            const channel = guild.channels.cache.find(ch => ch.name === channelName);
                            // If the channel doesn't exist, contacts the admin
                            if(!channel) {
                                const adminMember = guild.members.cache.find(member => member.id === (process.env.ADMIN_ID || adminID));
                                return adminMember.send(missingChannelMessage(guild.name, channelName));
                            }
                            // Si le channel existe on prépare un embed message à envoyer
                            const response = new Discord.MessageEmbed()
                                .setTitle(lastNew)
                                .setURL(gameLink)
                                .setDescription("Epic propose régulièrement des promotions sur son client EGS, ainsi qu'un jeu offert tous les jeudis !")
                                .setThumbnail(botAvatar)
                                .addField('Source :', newLink)
                                .setImage(imgThumb);

                            // Seeks for the role to mention
                            const role = guild.roles.cache.find(role => role.name === roleToMention);
                            if(!role) {
                                console.error(`egsFetcher : Je n'ai pas trouvé le rôle ${roleToMention} sur le serveur ${guild.name}...`);
                                channel.send(`J'ai trouvé une nouvelle promo intéressante sur l'Epic Games Store !`)
                                    .then(() => {
                                        return channel.send(response)
                                    });
                            }

                            channel.send(`<@&${role.id}> J'ai trouvé une nouvelle promo intéressante sur l'Epic Games Store !`)
                                .then(() => {
                                    return channel.send(response);
                                });
                        });
                    });
            });
    }, 1000 * 60 * timeInMinutes);
};