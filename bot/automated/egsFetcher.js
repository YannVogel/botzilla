const Discord = require('discord.js');
const rp = require('request-promise');
const cheerio = require('cheerio');
const {botAvatar} = require('../../config');
const EgsProms = require('../../models/egsProms');
const missingChannelMessage = require('./_missingChannelMessage');


module.exports = (botClient, timeInMinutes, channelName) => {
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

                        botClient.guilds.forEach(guild => {
                            const channel = guild.channels.find(ch => ch.name === channelName);
                            // If the channel doesn't exist, contacts the server owner
                            if(!channel) {
                                return guild.owner.user.send(missingChannelMessage(guild.name, channelName));
                            }
                            // Si le channel existe on prépare un embed message à envoyer
                            const response = new Discord.RichEmbed()
                                .setTitle(lastNew)
                                .setURL(gameLink)
                                .setDescription("Epic propose régulièrement des promotions sur son client EGS, ainsi qu'un jeu offert tous les jeudis !")
                                .setThumbnail(botAvatar)
                                .addField('Source :', newLink)
                                .setImage(imgThumb);

                            channel.send("@everyone J'ai trouvé une nouvelle promo intéressante sur l'Epic Games Store !");
                            return channel.send(response);
                        });
                    });
            });
    }, 1000 * 60 * timeInMinutes);
}