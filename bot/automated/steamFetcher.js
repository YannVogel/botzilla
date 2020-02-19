const Discord = require('discord.js');
const cheerio = require('cheerio');
const rp = require('request-promise');
const {botAvatar} = require('../../config');
const SteamSales = require('../../models/steamSales');
const missingChannelMessage = require('../_missingChannelMessage');
const dayToRefreshDB = 10;  // Every x days, the DB will delete the old content
const desiredTags = 3;      // Number of game tags to display

function isAnElementUnexpected(botClient, array, adminChannelName) {
    for(let i = 0; i < array.length; i++) {
        if(typeof array[i][1] !== 'string') {
            botClient.guilds.cache.forEach(guild => {
                const channel = guild.channels.cache.find(ch => ch.name === adminChannelName);

                if (!channel) return;

                channel.send(`${guild.owner}J'ai abandonné la fonction steamFetcher car ${array[i][0]} n'était pas un string mais un ${typeof array[i][1]}`);
            });
            // Return true if an element is not a "string"
            return true;
        }
    }
    return false;
}

function embedMessage(data) {
    // If an offer is an "offer of the day" (= no timer)
    if(data.offerInformations.includes("OFFRE DU JOUR")) {
        // Clean the timer part of the offerInformations
        data.offerInformations = "OFFRE DU JOUR !"
    }

    return new Discord.MessageEmbed()
        .setColor('#cfbb72')
        .setTitle(`${data.gameName}`)
        .setURL(data.frenchOfferLink)
        .setAuthor(data.offerInformations,
            data.gameIcon,
            data.frenchOfferLink)
        .setDescription(data.gameDescription)
        .setThumbnail(botAvatar)
        .addField('Réduction', `~~${data.regularPrice}~~ :point_right: **${data.discountPrice}** 
        \`\`\`JavaScript
        ${data.discountPourcentage} de réduction\`\`\``)
        .addField('Évaluations récentes', `${data.recentEvaluation} (${data.recentEvaluationNumber} avis)`)
        .addField('Évaluation globale', `${data.globalEvaluation} (${data.globalEvaluationNumber} avis)`)
        .setImage(data.offerImage)
        .setFooter(`Tags populaires : ${data.gameTags}`, data.gameIcon);
}

function getGameData(html, frenchOfferLink, offerImage) {
    const $ = cheerio.load(html);

    const gameName = $('div.apphub_AppName', html).text();
    const gameIcon = $('div.apphub_AppIcon>img', html).attr('src');
    const offerInformations = $('p.game_purchase_discount_countdown', html).text();
    const gameDescriptionRaw = $('div.game_description_snippet', html).text();
    const gameDescription =  gameDescriptionRaw.replace(/\t?\n?/g, '');
    const discountPrice = $('div.discount_final_price', html).eq(0).text();
    const regularPrice = $('div.discount_original_price', html).eq(0).text();
    const discountPourcentage = $('div.discount_pct', html).eq(0).text();
    const recentEvaluation = $('div.summary>span.game_review_summary', html).eq(0).text();
    const recentEvaluationNumberRaw = $('div.summary>span.responsive_hidden', html).eq(0).text();
    const recentEvaluationNumber = recentEvaluationNumberRaw.replace(/\t?\n?\(?\)?/g, '');
    const globalEvaluation = $('div.summary>span.game_review_summary', html).eq(1).text();
    const globalEvaluationNumberRaw = $('div.summary>span.responsive_hidden', html).eq(1).text();
    const globalEvaluationNumber = globalEvaluationNumberRaw.replace(/\t?\n?\(?\)?/g, '');

    let gameTags = '';
    for(let i = 0; i < desiredTags; i++) {
        gameTags += $('div.glance_tags.popular_tags>a', html).eq(i).text().replace(/\t?\n?/g, '');
        i + 1 === desiredTags ? gameTags += '' : gameTags += ' - ';
    }

    return {frenchOfferLink, offerImage, gameName, gameIcon, gameDescription, offerInformations, regularPrice,
        discountPrice, discountPourcentage, recentEvaluation,globalEvaluation, recentEvaluationNumber,
        globalEvaluationNumber, gameTags};
}

function dbManagement(botClient, offerLink, frenchOfferLink, offerImage, channelName, adminChannelName, roleToMention){
    SteamSales.findOne({gameLink: offerLink})
        .then(steamSales => {
            // Si la promo existe déjà...
            if(steamSales) {
                const today = new Date();
                // ... si la promo a plus de 10 jours...
                if((today.getTime() - steamSales.createdAt.getTime()) / (24 * 60 * 60 * 1000) > dayToRefreshDB) {
                    // ... on la supprime de la BDD
                    steamSales.delete();
                }else {
                    // ... sinon on arrête la fonction
                    return;
                }
            }

            const newSteamSales = new SteamSales({
                gameLink: offerLink,
                createdAt: new Date()
            });

            // On ajoute la promo en nouvelle entrée de BDD
            newSteamSales.save();

            rp(frenchOfferLink)
                .then(html => {

                    const data = getGameData(html, frenchOfferLink, offerImage);

                    const entries = Object.entries(data);
                    // Si une entrée dans data n'est pas sous la forme de "string", on arrête la fonction
                    if(isAnElementUnexpected(botClient, entries, adminChannelName)) {
                        return console.error("Il m'a manqué un élément pour afficher correctement la promo Steam...");
                    }

                    botClient.guilds.cache.forEach(guild => {
                        const channel = guild.channels.cache.find(ch => ch.name === channelName);
                        // If the channel doesn't exist, contacts the server owner
                        if(!channel) {
                            return guild.owner.user.send(missingChannelMessage(guild.name, channelName));
                        }

                        // Seeks for the role to mention
                        const role = guild.roles.cache.find(role => role.name === roleToMention);
                        if(!role) {
                            console.error(`egsFetcher : Je n'ai pas trouvé le rôle ${roleToMention} sur le serveur ${guild.name}...`);
                            channel.send(`J'ai trouvé une nouvelle promo intéressante sur l'Epic Games Store !`)
                                .then(() => {
                                    return channel.send(embedMessage(data));
                                });
                        }

                        channel.send(`<@&${role.id}> J'ai trouvé une nouvelle promo intéressante sur Steam !`)
                            .then(() => {
                                return channel.send(embedMessage(data));
                            });
                    });

                }).catch(err =>{ console.log(err); });
        })
}

module.exports = (botClient, timeInMinutes, channelName, adminChannelName, roleToMention) => {
    botClient.setInterval(() => {
        const url = `https://store.steampowered.com/?l=french`;

        // Fetch the midweek madness deals
        rp(url)
            .then(html => {
                const $ = cheerio.load(html);
                const divOffers = $('div.home_area_spotlight', html);
                if (!divOffers) return console.error("Je n'ai trouvé aucune offre de mi-semaine sur Steam...");
                const totalOffers = divOffers.length;
                for (let i = 0; i < totalOffers; i++) {
                    const divImgOffer = 'div.spotlight_img';
                    const offerLink = $(`${divImgOffer}>a`, html)[i].attribs.href.split('/?')[0];
                    const frenchOfferLink = `${offerLink}/?l=french`;
                    const offerImage = $(`${divImgOffer}>a>img`, html)[i].attribs.src;

                    dbManagement(botClient, offerLink, frenchOfferLink, offerImage, channelName, adminChannelName, roleToMention);
                }
            }).catch(err => {
            console.log(err);
        });
        // Fetch the today's deals
        rp(url)
            .then(html => {
                const $ = cheerio.load(html);
                const divOffers = $('a.daily_deal', html);
                if (!divOffers) return console.error("Je n'ai trouvé aucune offre du jour sur Steam...");
                const totalOffers = divOffers.length;

                for (let i = 0; i < totalOffers; i++) {
                    const offerLink = $('a.daily_deal', html)[i].attribs.href.split('/?')[0];
                    const frenchOfferLink = `${offerLink}/?l=french`;
                    const offerImage = $('a.daily_deal>div.capsule>img', html)[i].attribs.src;

                    dbManagement(botClient, offerLink, frenchOfferLink, offerImage, channelName, adminChannelName, roleToMention);
                }
            }).catch(err => {
            console.log(err);
        });
    }, 1000 * 60 * timeInMinutes);
};