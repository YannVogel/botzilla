const Discord = require('discord.js');
const rp = require('request-promise');
const cheerio = require('cheerio');
const {botAvatar} = require('../../config');
const GamesFeed = require('../../models/gamesFeed');
const missingChannelMessage = require('../_missingChannelMessage');

module.exports = (botClient, timeInMinutes, gameId, channelName, roleToMention) => {
    botClient.setInterval(() => {
        const url = `https://steamcommunity.com/app/${gameId}/announcements/`;
        rp(url)
            .then(html => {
                //success!
                const $ = cheerio.load(html);

                const gameName = $('div.apphub_CardContentAuthorName', html).eq(0).text();
                const category = "news";
                const title = $('div.apphub_CardContentNewsTitle', html).eq(0).text();
                const urlSource = $('div.apphub_Card.Announcement_Card.modalContentLink.interactable', html).eq(0).attr('data-modal-content-url');
                const image = $('div.appHubNewsIconHolder>img', html).eq(0).attr('src');


                GamesFeed.findOne({urlSource: urlSource})
                    .then(gamesFeed => {
                        // Si la new existe déjà, on arrête tout
                        if (gamesFeed) return;

                        // On vérifie si une new de ce jeu existe déjà
                        GamesFeed.findOneAndUpdate({gameName: gameName})
                            .then(gamesFeed => {
                                // Si c'est le cas, on remplace par la nouvelle
                                if(gamesFeed) {
                                    gamesFeed.title = title;
                                    gamesFeed.urlSource = urlSource;
                                    gamesFeed.image = image;

                                    gamesFeed.save();
                                } else {
                                    // Sinon on créé l'entrée dans la BDD
                                    const newGamesFeed = new GamesFeed({
                                        game: gameName,
                                        category: category,
                                        title: title,
                                        urlSource: urlSource,
                                        image: image
                                    });
                                    newGamesFeed.save();
                                }

                                botClient.guilds.forEach(guild => {
                                    const channel = guild.channels.find(ch => ch.name === channelName);
                                    // If the channel doesn't exist, stops everything
                                    if(!channel) {
                                        return;
                                    }
                                    // Si le channel existe on prépare un embed message à envoyer
                                    const response = new Discord.RichEmbed()
                                        .setTitle(title)
                                        .setURL(urlSource)
                                        .setThumbnail(botAvatar)
                                        .addField('Source :', urlSource)
                                        .setImage(image);

                                    // Seeks for the role to mention
                                    const role = guild.roles.find(role => role.name === roleToMention);
                                    if(!role) {
                                        console.error(`steamFeed : Je n'ai pas trouvé le rôle ${roleToMention} sur le serveur ${guild.name}...`);
                                        channel.send(`Une nouvelle mise à jour de ${gameName} a été publiée !`);
                                        return channel.send(response)
                                    }

                                    channel.send(`<@&${role.id}> Une nouvelle mise à jour de ${gameName} a été publiée !`)
                                        .then(() => {
                                            return channel.send(response);
                                        });
                                });

                            });
                    });
            });
    }, 1000 * 60 * timeInMinutes);
};