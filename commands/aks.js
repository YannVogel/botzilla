const {prefix} = require('../config');
const rp = require('request-promise');
const cheerio = require('cheerio');

module.exports = {
    name: 'aks',
    description: 'Recherche sur le site allkeyshop',
    args: true,
    usage: '[dlc] <game>',
    guildOnly: false,
    cooldown: 0,
    execute(message, args) {
        let url = '';
        let research = '';
        if (args[0] !== "dlc") {
            console.log('Recherche d\'un jeu');
            research = args.join('+');
            url = `https://www.allkeyshop.com/blog/catalogue/category-pc-games-all/search-${research}/`;
        }else {
            console.log('Recherche d\'un contenu digital');
            args[0] = '';
            research = args.join('+');
            url = `https://www.allkeyshop.com/blog/catalogue/category-pc-digital-all/search-${research}/`;
        }


        rp(url)
            .then(html => {
                //success!
                const $ = cheerio.load(html);
                if($('.search-results-row a', html).length === 0) {
                    return message.reply(`Aucun résultat trouvé pour la recherche **${research}**`)
                }
                let gameTitle = [];
                let gamePrice = [];
                let gameLink = [];
                let response = [];
                for (let i = 0; i < $('.search-results-row a', html).length; i++) {
                    gamePrice.push($('.search-results-row-price', html).eq(i).text());
                    gameLink.push($('.search-results-row a', html).eq(i).attr('href').slice(12));
                    gameTitle.push($('.search-results-row a .search-results-row-game-title', html).eq(i).text());
                    response.push(gameTitle[i] +" **"+gamePrice[i] +"**\n`"+ gameLink[i]+"`\n__________");
                }
                response = response.toString();
                let formattedResponse = '';
                for(let resp of response) {
                    formattedResponse += resp.replace(/,/, '\n');
                }

                return message.reply(formattedResponse+ "\nPage des résultats : "+ url);

            })
            .catch(err =>{
                //handle error
                return console.log(err);
            });
    }
};