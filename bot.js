const fs = require('fs');
const Discord = require('discord.js');
const {prefix} = require('./config.json');
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();
const {token} = process.env.BOT_TOKEN || require('./auth.json');
const {adminID} = process.env.ADMIN_ID || require('./auth.json');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const mongoose = require('mongoose');
const {dbLogin} = process.env.DB_LOGIN || require('./auth.json');
const {dbPassword} = process.env.DB_PASSWORD || require('./auth.json');
const botZillaChannel = 'botzilla';

mongoose.connect(`mongodb+srv://${process.env.DB_LOGIN || dbLogin}:${process.env.DB_PASSWORD || dbPassword}@botzilla-cluster-dtt3l.mongodb.net/test?retryWrites=true&w=majority`,
    { useNewUrlParser: true,
        useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(error => console.error("Impossible de se connecter à la BDD : " + error));


/* ------------------------------ 🢃 AUTOMATISATION DE L'AFFICHAGE DES PROMOS EGS 🢃 ------------------------------ */
const rp = require('request-promise');
const cheerio = require('cheerio');
const EgsProms = require('./models/egsProms');

bot.setInterval( () => {
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

                    bot.guilds.forEach(guild => {
                        const channel = guild.channels.find(ch => ch.name === botZillaChannel);
                        // Si le channel n'existe pas on contacte en DM le propriétaire du Discord
                        if(!channel) {
                            return guild.owner.user.send("Désolé de t'importuner mais il me semble que tu es " +
                                "le propriétaire du Discord **" + guild.name + "** et je n'ai pas réussi à y " +
                                "envoyer un message car ce Discord ne dispose pas de salon textuel nommé \"**" + botZillaChannel + "**\"." +
                                "\nCe salon me permet de prévenir ta communauté de toute sorte d'infos intéressants" +
                                "\nTu peux remédier à ce problème en créant un salon textuel \"**" + botZillaChannel + "**\" et " +
                                "m'y donner les droits d'écriture. Où tu peux ignorer ce message si tu ne désires pas " +
                                "diffuser ces informations." +
                                "\n Bonne journée et merci encore d'utiliser botZilla !");
                        }
                        // Si le channel existe on prépare un embed message à envoyer
                        const response = new Discord.RichEmbed()
                            .setTitle(lastNew)
                            .setURL(gameLink)
                            .setDescription("Epic propose régulièrement des promotions sur son client EGS, ainsi qu'un jeu offert tous les jeudis !")
                            .addField('Source :', newLink)
                            .setImage(imgThumb);

                        channel.send("@everyone J'ai trouvé une nouvelle promo intéressante sur l'Epic Games Store !");
                        return channel.send(response);
                    });
                });
        });
},1000*60*30); // Toutes les 30 minutes

/* ------------------------------ 🢁 AUTOMATISATION DE L'AFFICHAGE DES PROMOS EGS 🢁 ------------------------------ */

/* ------------------------------ 🢃 AUTOMATISATION DE L'AFFICHAGE DES PROMOS STEAM 🢃 ------------------------------ */
const {botAvatar} = require('./config');
const SteamSales = require('./models/steamSales');

function embedMessage(data) {
    return new Discord.RichEmbed()
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
    const desiredTags = 3;
    for(let i = 0; i < desiredTags; i++) {
        gameTags += $('div.glance_tags.popular_tags>a', html).eq(i).text().replace(/\t?\n?/g, '');
        i + 1 === desiredTags ? gameTags += '' : gameTags += ' - ';
    }

    return {frenchOfferLink, offerImage, gameName, gameIcon, gameDescription, offerInformations, regularPrice,
        discountPrice, discountPourcentage, recentEvaluation,globalEvaluation, recentEvaluationNumber,
        globalEvaluationNumber, gameTags};
}

function dbManagement(offerLink, frenchOfferLink, offerImage){
    SteamSales.findOne({gameLink: offerLink})
        .then(steamSales => {
            // Si la promo existe déjà, on arrête tout
            if(steamSales) return;

            const newSteamSales = new SteamSales({
                gameLink: offerLink
            });

            // On ajoute la promo en nouvelle entrée de BDD
            newSteamSales.save();

            rp(frenchOfferLink)
                .then(html => {

                    const data = getGameData(html, frenchOfferLink, offerImage);

                    bot.guilds.forEach(guild => {
                        const channel = guild.channels.find(ch => ch.name === botZillaChannel);
                        // Si le channel n'existe pas on contacte en DM le propriétaire du Discord
                        if (!channel) {
                            return guild.owner.user.send("Désolé de t'importuner mais il me semble que tu es " +
                                "le propriétaire du Discord **" + guild.name + "** et je n'ai pas réussi à y " +
                                "envoyer un message car ce Discord ne dispose pas de salon textuel nommé \"**" + botZillaChannel + "**\"." +
                                "\nCe salon me permet de prévenir ta communauté de toute sorte d'infos intéressants" +
                                "\nTu peux remédier à ce problème en créant un salon textuel \"**" + botZillaChannel + "**\" et " +
                                "m'y donner les droits d'écriture. Où tu peux ignorer ce message si tu ne désires pas " +
                                "diffuser ces informations." +
                                "\n Bonne journée et merci encore d'utiliser botZilla !");
                        }

                        channel.send("@everyone J'ai trouvé une nouvelle promo intéressante sur Steam !");
                        return channel.send(embedMessage(data));
                    });

                }).catch(err =>{ console.log(err); });
        })
}

bot.setInterval( () => {
    const url = `https://store.steampowered.com/?l=french`;

    const today = new Date().getDay();
    // If it's wednesday (= steam midweek madness day)
    if (today === 3) {
        rp(url)
            .then(html => {
                const $ = cheerio.load(html);
                const divOffers = $('div.home_area_spotlight', html);
                const totalOffers = divOffers.length;
                for (let i = 0; i < totalOffers; i++) {
                    const divImgOffer = 'div.spotlight_img';
                    const offerLink = $(`${divImgOffer}>a`, html)[i].attribs.href;
                    const frenchOfferLink = `${offerLink.split('/?')[0]}/?l=french`;
                    const offerImage = $(`${divImgOffer}>a>img`, html)[i].attribs.src;

                    dbManagement(offerLink, frenchOfferLink, offerImage);
                }
            }).catch(err => {
            console.log(err);
        });
    }
    // Fetch the today's deals
    rp(url)
        .then(html => {
            const $ = cheerio.load(html);
            const divOffers = $('a.daily_deal', html);
            const totalOffers = divOffers.length;

            for (let i = 0; i < totalOffers; i++) {
                const offerLink = $('a.daily_deal', html)[i].attribs.href;
                const frenchOfferLink = `${offerLink.split('/?')[0]}/?l=french`;
                const offerImage = $('a.daily_deal>div.capsule>img', html)[i].attribs.src;

                dbManagement(offerLink, frenchOfferLink, offerImage);
            }
        }).catch(err => {
        console.log(err);
    });
},1000*60*30); // Toutes les 30 minutes
/* ------------------------------ 🢁 AUTOMATISATION DE L'AFFICHAGE DES PROMOS STEAM 🢁 ------------------------------ */

/* ------------------------------ 🢃 AUTOMATISATION DE LA NOTIFICATION DU DÉBUT DE STREAM 🢃 ------------------------------ */
const TwitchClient  = require('twitch').default;
const {twitchClientID}  = process.env.TWITCH_ID || require('./auth.json');
const {twitchClientSecret} = process.env.TWITCH_SECRET || require('./auth.json');
const twitch = TwitchClient.withClientCredentials(process.env.TWITCH_ID || twitchClientID,
    process.env.TWITCH_SECRET || twitchClientSecret);
const streamer = 'bobzill4tv';
const streamLink = 'https://www.twitch.tv/' + streamer;
// Permet de ne pas spammer un chan quand un streamer est en live, le but étant de n'avetir qu'une seule fois
let firstNotification = true;

async function isStreamLive(userName) {
    const user = await twitch.helix.users.getUserByName(userName);
    if (!user) {
        return false;
    }
    return await twitch.helix.streams.getStreamByUserId(user.id) !== null;
}

bot.setInterval( () => {
    isStreamLive(streamer)
        .then((isLive) => {
            if (isLive) {
                if(firstNotification) {
                    bot.guilds.forEach(guild => {
                        const channel = guild.channels.find(ch => ch.name === botZillaChannel);
                        firstNotification = false;

                        if (!channel) return;
                        return channel.send(`@here ${streamer} a commencé son live ! Rendez-vous sur sa chaîne : ${streamLink} !`);
                    });
                }
            }else {
                firstNotification = true;
            }
        });
},1000*60); // Toutes les minutes

/* ------------------------------ 🢁 AUTOMATISATION DE LA NOTIFICATION DU DÉBUT DE STREAM 🢁 ------------------------------ */

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    bot.commands.set(command.name, command);
}

bot.once('ready', () => {

    bot.user.setStatus('online')
        .then()
        .catch( error => {console.log('Erreur lors de l\'attribution du statut du bot : '+error)});
    bot.user.setPresence({
        game: {
            name: 'conquérir le monde' }})
                .then()
                .catch( error => {console.log('Erreur lors de l\'attribution de l\' activité du bot : '+error)});

    console.log('botZilla is ready to go!');
    process.env.BOT_TOKEN ?
        console.log('Currently listening from heroku server!') :
        console.log('Currently listening from local host!');
});


// Create an event listener for new guild members
bot.on('guildMemberAdd', member => {
    // Send the message to a designated channel on a server:
    const channel = member.guild.channels.find(ch => ch.name === 'discussion');
    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    // Send the message, mentioning the member
    channel.send(`Bienvenue sur le serveur de la Bobzilla Family, ${member} !`);
});



bot.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!bot.commands.has(commandName)) return;



    const command = bot.commands.get(commandName);

    if (command.guildOnly && message.channel.type !== 'text') {
        return message.reply('Je ne peux pas utiliser cette commande dans les messages privés !');
    }

    if (command.adminOnly && message.author.id !== (process.env.ADMIN_ID || adminID)) {
        console.log(`Commande "${command.name}" a été bloquée : réclamée par ${message.author.username} sur le serveur ${message.guild}.`);
        return message.reply('Désolé mais cette commande est réservée à l\'administration du bot.');
    }

    if (command.args && !args.length) {
        let reply = `Tu n'as précisé aucun argument, ${message.author}!`;

        if (command.usage) {
            reply += `\nLa bonne syntaxe est : \`${prefix}${command.name} ${command.usage}\``;
        }

        return message.channel.send(reply);
    }

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 1) * 1000;

    if (timestamps.has(message.author.id)) {

        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`Merci d'attendre encore ${timeLeft.toFixed(1)} secondes avant d'utiliser la commande \`${command.name}\` de nouveau.`);
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

        try {
            command.execute(message, args);
            console.log(`Commande "${command.name}" a réussi : réclamée par ${message.author.username} sur le serveur ${message.guild}.`);
        } catch (error) {
            console.error(error);
            console.log(`Commande "${command.name}" a renvoyé une erreur : réclamée par ${message.author.username} sur le serveur ${message.guild}.`);
            return message.reply('Une erreur s\'est produite lors de l\'exécution de cette commande');
        }
});

bot.login(process.env.BOT_TOKEN || token);