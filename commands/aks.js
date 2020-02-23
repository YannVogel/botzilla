const {prefix} = require('../config');
const rp = require('request-promise');
const cheerio = require('cheerio');

module.exports = {
    name: 'aks',
    description: 'Recherche un jeu ou un DLC sur le site allkeyshop.',
    args: true,
    usage: '[dlc] <game>',
    cooldown: 0,
    execute(message, args) {
        let url = '';
        let research = '';
        if (args[0] !== "dlc") {
            research = args.join('+');
            if(!research) { return message.reply('Vous devez préciser un jeu à chercher !');}
            url = `https://www.allkeyshop.com/blog/catalogue/category-pc-games-all/search-${research}/`;
        }else {
            args[0] = '';
            research = args.join('+');
            if(!research) { return message.reply('Vous devez préciser un jeu à chercher !');}
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

                formattedResponse.length > 1999 ?
                    message.reply('Il y a trop de résultats pour les afficher sur Discord... Merci d\'être plus précis dans ta recherche !\n' + 'Page des résultats : '+ url)
                    : message.reply(formattedResponse+ "\nPage des résultats : "+ url);
            })
            .catch(err =>{
                //handle error
                return console.log(err);
            });
    }
};