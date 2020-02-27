module.exports = {
    getFormattedCooldown: (timeInSeconds) => {
        const hours = Math.floor(timeInSeconds / 3600);
        timeInSeconds -= hours * 3600;
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds - minutes * 60;

        if(hours) {
            return `${hours} h ${minutes} min ${seconds} sec`;
        }else if(minutes) {
            return `${minutes} min ${seconds} sec`;
        }else {
            return `${seconds} sec`;
        }
    }
};