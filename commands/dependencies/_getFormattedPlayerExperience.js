module.exports = {
    // This function allows to replace traditional experience number by a "k" for the thousands
    getFormattedExperience: experience => {
        if(experience/1000 < 1){
            return experience;
        }
        const arrayOfExp = Array.from(experience.toString());
        let formattedExperience = '';
        for(let i = 0; i < arrayOfExp.length - 2; i++){
            if(i + 3 === arrayOfExp.length){
                formattedExperience += 'k';
                if (arrayOfExp[i] === '0') break;
            }
            formattedExperience += arrayOfExp[i];
        }
        return formattedExperience;
    }
};