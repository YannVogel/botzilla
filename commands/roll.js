const random = require('./dependencies/_getRandomInt.js');

function calculateModifier(message, tempResult, modifierSign, modifierValue) {
    let finalResult = 0;
    if(modifierSign === '+'){
        finalResult = tempResult + modifierValue;
    }else {
        finalResult = tempResult - modifierValue;
    }
    return message.reply(`Résultat final après avoir appliqué le modificateur \`${modifierSign}${modifierValue}\` : \`${finalResult}\``);
}

module.exports = {
    name: 'roll',
    aliases: ['rl'],
    description: 'Jette un dé du nombre de faces demandées (ou un dé 6 par défaut).',
    usage: '<nombre de faces> ou <xdy> avec x le nombre de dé(s) et y le nombre de face par dé',
    cooldown: 0,
    execute(message, args) {
        let isCursedUser = (message.author.id === "242956488522465281" || message.author.id === "191498235095810048");
        if(isCursedUser){
            console.log("Commande réclamée par un joueur maudit !");
            isCursedUser = (random.getRandomInt(10) !== 4);
            console.log(isCursedUser ? 'La malédiction a persisté !' : 'La malédiction s\'est dissipée...');
        }


        if(args[0] && (args[0].includes("d") || args[0].includes("D"))) {
            const syntax = args[0].includes("d") ? args[0].split("d") : args[0].split("D");
            const diceNumber = parseInt(syntax[0], 10);
            const faceNumber = parseInt(syntax[1], 10);
            const isThereAnyModifier = message.toString().includes('+') || message.toString().includes('-');
            let modifierSign = '';
            let modifierValue = 0;

            if(isThereAnyModifier) {
                if(message.toString().includes('+')) {
                    modifierSign = '+';
                }else {
                    modifierSign = '-'
                }
                modifierValue = parseInt(message.toString().split(modifierSign)[1], 10);
            }

            if(isNaN(diceNumber) || isNaN(faceNumber) || diceNumber === 0 || faceNumber === 0 || isNaN(modifierValue)) {
                return message.channel.send(`Désolé mais je n'ai pas reconnu la syntaxe de \`${message.toString()}\`...`);
            }
            if(diceNumber === 1) {
                return message.reply(`jette un dé ${faceNumber} et obtient \`${random.getRandomInt(isCursedUser ? Math.round(faceNumber/2) : faceNumber) + 1}\``);
            }

            let sum = 0;
            for(let i = 0; i < diceNumber; i++) {
                let randomResult = random.getRandomInt(isCursedUser ? Math.round(faceNumber/2) : faceNumber) + 1;
                message.author.send(`jette un dé ${faceNumber} et obtient \`${randomResult}\`.`)
                    .catch(console.error);
                sum += randomResult;
            }
            return message.reply(`Somme du lancer de ${diceNumber} dé${diceNumber > 1 ? 's' : ''} à ${faceNumber} face${faceNumber > 1 ? 's' : ''} : \`${sum}\`.`)
                .then(() => {
                    if(isThereAnyModifier) {
                        calculateModifier(message, sum, modifierSign, modifierValue);
                    }
                });

        }else if(args[0] && isNaN(args[0])) {
            return message.channel.send(`Désolé mais "${args[0]}" n'est pas un nombre...`);
        }
        if(parseInt(args[0], 10) === 0) return message.channel.send(`Impossible de lancer un dé avec un nombre de face nul !`);
        if(!args[0]) args[0] = 6;

        return message.reply(`jette un dé ${args[0]} et obtient \`${random.getRandomInt(isCursedUser ? Math.round(args[0]/2) : args[0]) + 1}\`.`);
    }
};