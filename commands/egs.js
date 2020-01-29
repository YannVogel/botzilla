const Discord = require('discord.js');

const {prefix} = require('../config');
const rp = require('request-promise');
const cheerio = require('cheerio');


module.exports = {
    name: 'egs',
    description: "Affiche la/les dernière(s) promotion(s) de l'Epic Game Store",
    args: false,
    usage: '[nombre de deals souhaités]',
    guildOnly: false,
    adminOnly: false,
    cooldown: 0,
    execute(message, args) {
        const url = 'https://www.reddit.com/r/GameDeals/search?q=site:epicgames.com+OR+title:epicgamestore+OR+title:%22epic+game+store%22+OR+title:%22EGS%22+OR+title:%22epic+games%22&restrict_sr=on&sort=new&include_over_18=on&feature=legacy_search';
        const dealNumbers = (args[0] ? args[0] : 1) ;
        if(dealNumbers > 5){ return message.reply("Par souci de lisibilité, je ne peux afficher que les 5 derniers deals...") }
        rp(url)
            .then(html => {
                //success!
                const $ = cheerio.load(html);
                const lastNew = $('h3._eYtD2XCVieq6emjKBH3m', html).eq(0).text().split(/^\[[\w*\s?]*] /).join('');
                const newLink = 'https://www.reddit.com'+$('a.SQnoC3ObvgnGjWt90zD9Z._2INHSNB8V5eaWp4P0rY_mE', html).eq(0)[0].attribs.href;
                const imgThumb = $('div._2c1ElNxHftd8W_nZtcG9zf._33Pa96SGhFVpZeI6a7Y_Pl._2e9Lv1I3dOmICVO9fg3uTG', html).eq(0)[0].attribs.style.split('url(')[1].split(');')[0];
                const gameLink = $('a._13svhQIUZqD9PVzFcLwOKT.styled-outbound-link', html)[0].attribs.href.split('en-US').join('fr');

                const response = new Discord.RichEmbed()
                    .setTitle(lastNew)
                    .setURL(gameLink)
                    .setDescription("Epic propose régulièrement des promotions sur son client EGS, ainsi qu'un jeu offert tous les jeudis !")
                    .addField('Source :', newLink)
                    .setImage(imgThumb);

                message.channel.send(response);

                for(let i = 1; i < dealNumbers; i++)
                {
                    const lastNew = $('h3._eYtD2XCVieq6emjKBH3m', html).eq(i).text().split(/^\[[\w*\s?]*] /).join('');
                    const newLink = 'https://www.reddit.com'+$('a.SQnoC3ObvgnGjWt90zD9Z._2INHSNB8V5eaWp4P0rY_mE', html).eq(i)[0].attribs.href;
                    const gameLink = $('a._13svhQIUZqD9PVzFcLwOKT.styled-outbound-link', html)[i].attribs.href.split('en-US').join('fr');

                    const response = new Discord.RichEmbed()
                        .setTitle(lastNew)
                        .setURL(gameLink);

                    message.channel.send(response);
                }

                return message.reply("Voici les derniers deals de l'Epic Games Store que j'ai trouvés !");
            })
            .catch(err =>{
                //handle error
                console.log(err);
            });
    }
};