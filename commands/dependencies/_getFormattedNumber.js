module.exports = {
    // This function allows to replace traditional number by a "k" for the thousands
    getFormattedNumber: number => {
        if(number/1000 < 1){
            return number;
        }
        const arrayOfExp = Array.from(number.toString());
        let formattedExperience = '';
        for(let i = 0; i < arrayOfExp.length - 2; i++){
            if(i + 3 === arrayOfExp.length){
                formattedExperience += '**K**';
                if (arrayOfExp[i] === '0') break;
            }
            formattedExperience += arrayOfExp[i];
        }
        return formattedExperience;
    }
};