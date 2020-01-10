const {prefix} = require('../config');
const rp = require('request-promise');
const cheerio = require('cheerio');


module.exports = {
    name: 'egs',
    description: 'Affiche le(s) jeu(x) gratuit(s) de la semaine sur l\'Epic Game Store',
    args: false,
    usage: '',
    guildOnly: false,
    adminOnly: false,
    cooldown: 0,
    execute(message, args) {
        const url = 'https://www.reddit.com/r/GameDeals/search?q=site:epicgames.com+OR+title:epicgamestore+OR+title:%22epic+game+store%22+OR+title:%22EGS%22+OR+title:%22epic+games%22&restrict_sr=on&sort=new&include_over_18=on&feature=legacy_search';

        rp(url)
            .then(html => {
                //success!
                const $ = cheerio.load(html);
                const newsTab = $('h3._eYtD2XCVieq6emjKBH3m', html).text().split(/\[Epic Games Store\] /);
                const lastNew = newsTab.shift();

                return message.reply("```" +
                    newsTab[0]
                    + "```\n <https://www.epicgames.com/store/fr/free-games>");

            })
            .catch(err =>{
                //handle error
                console.log(err);
            });
    }
};