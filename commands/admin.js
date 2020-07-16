const PlayerSheet = require('../models/playerSheet');
/**
 * @class
 * @property {Number} id
 * @property {String} name
 * @property {Number} price
 * @property {Number} eventPrice
 * @property {String} description
 * @property {String} icon
 * @property {String} whenUsed
 * @property {Number} maxToBuy
 */
const items = require('./dependencies/gameMarket').item;
/**
 * @class
 * @property {Number} id
 * @property {String} name
 * @property {String} description
 * @property {String} icon
 */
const {materials} = require('./dependencies/materials');
const {currency, stamina} = require('../config');
const {experienceFormat} = require('../gameConfig');
const {thisPlayerHasThisItem} = require('./useItem');
const {getPlayerMaxStamina} = require('./dependencies/_getPlayerStamina');
const playerManager = require('./dependencies/_getPlayerSheet');
const methodArray = [
    "add", "remove", "fiche"
];

const elementArray = [
    "item", "material", "money", "stamina", "experience"
];

function argumentIsWellFormatted (argumentName, argumentArray) {
        let argumentCheck = 0;
        for(let i = 0; i < argumentArray.length; i++) {
            if(argumentName !== argumentArray[i]) {
                argumentCheck++;
            }
        }
        return argumentCheck !== argumentArray.length;
}

function isElementAvailable(nameOfTheElement, material = false) {
    const library = !material ? items : materials;
    let isElementAvailable = false;
    library.map(element => {
        if(nameOfTheElement === element.name) {
            nameOfTheElement = element;
            isElementAvailable = true;
        }
    });
    return [nameOfTheElement, isElementAvailable];
}

module.exports = {
    name: 'admin',
    description: "Accède au panneau d'administration",
    usage: "<@joueur> <method:'add','remove','fiche'> <element:'item','material','money','stamina','experience'> <name of the element> <amount>",
    creatorOnly: true,
    cooldown: 1,
    execute(message, args) {
        if (!message.mentions.users.size) {
            return message.reply('Il faut mentionner le joueur que tu veux administrer !');
        }
        if(message.mentions.users.size > 1) {
            return message.reply("Tu ne peux administrer qu'un joueur à la fois !");
        }
        const playerToAdmin = message.mentions.users.map(user => {
            return user;
        })[0];
        let method = args[1];
        let element = args[2];
        let elementToAdmin = args[3];
        // The amount is optional and is equal to "1" by default (useful for items/materials)
        const amount = !isNaN(parseInt(args[3], 10)) ? parseInt(args[3],10) : (args[4] ? parseInt(args[4],10) : 1);
        // Useful to detect if the command admin an object (item or material) or a value (money, stamina or experience)
        let adminAnObject = true;
        // Useful to detect what kind of non object (money, stamina or experience) has been modified
        let formatOfTheNonObject;

        if(!argumentIsWellFormatted(method, methodArray)) {
            return message.reply(`La méthode à utiliser doit avoir une de ces valeurs : \`${methodArray}\``);
        }

        if(method === "fiche") {
            async function getSheet() {
                const sheet = await playerManager.getPlayerSheet(playerToAdmin, true);
                return message.channel.send(sheet);
            }
            return getSheet().catch(console.error);
        }

        if(!argumentIsWellFormatted(element, elementArray)) {
            return message.reply(`L'élément à gérer doit avoir une de ces valeurs : \`${elementArray}\``);
        }
        if(isNaN(amount)) {
            return message.reply(`Le montant à ajouter doit être un nombre !`);
        }
        PlayerSheet.findOne({playerId: playerToAdmin.id})
            .then(player => {
                if (!player) {
                    return message.reply(`Ce joueur ne fait pas encore partie du jeu !`);
                }
                switch(element) {
                    case 'item':
                        const [item, isItemAvailable] = isElementAvailable(elementToAdmin);
                        if(!isItemAvailable) {
                            return message.reply(`Désolé mais je n'ai pas trouvé l'objet \`${elementToAdmin}\` à ajouter à ${player.playerName}...`);
                        }
                        elementToAdmin = item;
                        for(let i = 1; i <= amount; i++) {
                            method === "add" ?
                                player.playerInventory.push(elementToAdmin.name) :
                                player.playerInventory.splice(player.playerInventory.indexOf(elementToAdmin.name), 1);
                        }
                        break;

                    case 'material':
                        const [material, isMaterialAvailable] = isElementAvailable(elementToAdmin, true);
                        if(!isMaterialAvailable) {
                            return message.reply(`Désolé mais je n'ai pas trouvé le matériau \`${elementToAdmin}\` à ajouter à ${player.playerName}...`);
                        }
                        elementToAdmin = material;
                        for(let i = 1; i <= amount; i++) {
                            method === "add" ?
                                player.playerMaterials.push(elementToAdmin.name) :
                                player.playerMaterials.splice(player.playerMaterials.indexOf(elementToAdmin.name), 1);
                        }
                        break;

                    case 'money':
                        method === "add" ?
                            player.playerPurse += amount :
                            player.playerPurse -= amount;
                        if(player.playerPurse < 0) player.playerPurse = 0;
                        formatOfTheNonObject = currency;
                        adminAnObject = false;
                        break;

                    case 'stamina':
                        method === "add" ?
                            player.playerStamina += amount :
                            player.playerStamina -= amount;
                        if(player.playerStamina > getPlayerMaxStamina(player)) player.playerStamina = getPlayerMaxStamina(player);
                        if(player.playerStamina < 0) player.playerStamina = 0;
                        formatOfTheNonObject = stamina;
                        adminAnObject = false;
                        break;

                    case 'experience':
                        method === "add" ?
                            player.playerExperience += amount :
                            player.playerExperience -= amount;
                        if(player.playerExperience < 0) player.playerExperience = 0;
                        formatOfTheNonObject = experienceFormat;
                        adminAnObject = false;
                        break;
                }
                player.save()
                    .then(() => {
                        message.reply(`J'ai bien ${method === "add" ? 'ajouté' : 'enlevé'} **${amount}** ${adminAnObject ? elementToAdmin.icon : ''}${adminAnObject ? elementToAdmin.name : formatOfTheNonObject} au joueur <@${player.playerId}> !`)

                    });
            });
    }
};