module.exports = {
    name: 'improvehelp',
    description: "Donne de l'aide sur l'amélioration d'objet.",
    guildOnly: true,
    cooldown: 60,
    execute(message, args) {
        return message.reply("Voici tout ce que tu dois savoir sur l'amélioration d'objet !\n" +
            "Pour commencer, il te faut un \uD83C\uDF1F\`stardust\` dans tes matériaux !\n" +
            "Tu dois ensuite choisir quel objet tu veux améliorer avec la commande \`bz!improve\` ! Tu dois bien sûr posséder cet objet !\n" +
            ":green_circle:\`commonbag\` -> :blue_circle:\`rarebag\` : **90%** de chance de réussite\n" +
            "-\n" +
            ":blue_circle:\`rarebag\` -> :purple_circle:\`epicbag\` : **75%** de chance de réussite\n" +
            "-\n" +
            ":purple_circle:\`epicbag\` -> :orange_circle:\`legendarybag\` : **50%** de chance de réussite\n" +
            "-\n" +
            "En cas de réussite, ton objet verra sa qualité augmenter ! Et le \uD83C\uDF1F\`stardust\` sera consommé !\n" +
            "En cas d'échec, tu perdras l'objet de base, mais pas le \uD83C\uDF1F\`stardust\` !");
    }
};