const rp = require('request-promise');
const $ = require('cheerio');
const random = require('./dependencies/_getRandomInt.js');

module.exports = {
    name: 'quote',
    aliases: ['qo'],
    description: 'Affiche une citation du stream de Bob choisie au hasard.',
    args: false,
    guildOnly: false,
    adminOnly: false,
    cooldown: 0,
    execute(message, args) {
            const url = `https://twitch.center/customapi/quote/list?token=ecd68f5b`;

            rp(url)
                .then(html => {
                    //success!
                    const myLoader = $.load(html);
                    const quoteTable = html.split('\n');
                    const regex1 = /\d+. /;
                    const regex2 = /'?"?/g;
                    const randomNumber = random.getRandomInt(quoteTable.length);

                    for(let i = 0; i < quoteTable.length; i++) {
                        quoteTable[i] = quoteTable[i].replace(regex1,'');
                        quoteTable[i] = quoteTable[i].replace(regex2,'');
                    }

                    return message.channel.send(
                        `Citation n°${randomNumber + 1} :\n > ${quoteTable[randomNumber]}`);

                }).catch(err =>{ console.log(err); });
    }
};