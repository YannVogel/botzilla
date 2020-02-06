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


mongoose.connect(`mongodb+srv://${process.env.DB_LOGIN || dbLogin}:${process.env.DB_PASSWORD || dbPassword}@botzilla-cluster-dtt3l.mongodb.net/test?retryWrites=true&w=majority`,
    { useNewUrlParser: true,
        useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(error => console.error("Impossible de se connecter à la BDD : " + error));


/* ------------------------------ 🢃 AUTOMATISATION DE L'AFFICHAGE DES PROMOS EGS 🢃 ------------------------------ */
const rp = require('request-promise');
const cheerio = require('cheerio');
const EgsProms = require('./models/egsProms');
const egsPromsChannel = 'egs-promo';


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
                        const channel = guild.channels.find(ch => ch.name === egsPromsChannel);
                        // Si le channel n'existe pas on contacte en DM le propriétaire du Discord
                        if(!channel) {
                            return guild.owner.user.send("Désolé de t'importuner mais il me semble que tu es " +
                                "le propriétaire du Discord **" + guild.name + "** et je n'ai pas réussi à y " +
                                "envoyer un message car ce Discord ne dispose pas de salon textuel nommé \"**" + egsPromsChannel + "**\"." +
                                "\nCe salon me permet de prévenir ta communauté quand une nouvelle promo sur l'Epic Games Store est disponible" +
                                "\nTu peux remédier à ce problème en créant un salon textuel \"**" + egsPromsChannel + "**\" et " +
                                "m'y donner les droits d'écriture. Où tu peux ignorer ce message si tu ne désires pas " +
                                "être informé de ces promos." +
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
},1000*600);

/* ------------------------------ 🢁 AUTOMATISATION DE L'AFFICHAGE DES PROMOS EGS 🢁 ------------------------------ */


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