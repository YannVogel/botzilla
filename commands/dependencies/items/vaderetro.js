module.exports = {
    useVaderetroItem: player => {
        if(player.playerCurses)
        {
            player.playerCurses = 0;
            player.save();
        }
    }
};