module.exports = {
    name: 'dateserver',
    creatorOnly: true,
    cooldown: 60,
    execute(message, args) {
        const date = new Date();
        message.reply(`Année : ${date.getFullYear()}\nMois : ${date.getMonth()}\nJour : ${date.getDate()}\nHeure : ${date.getHours()}\nMinute : ${date.getMinutes()}\nSeconde : ${date.getSeconds()}`);
    }
};