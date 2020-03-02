module.exports = {
    useShowerItem: player => {
        if(player.playerCurses)
        {
            player.playerCurses--;
            player.save();
        }
    }
};