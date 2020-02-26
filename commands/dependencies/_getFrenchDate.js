const daysFr = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
];

const monthsFr = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre"
];

module.exports = {
    getFrenchDate: function(date) {

        const dayFr = daysFr[date.getDay()];
        const dayNumber = date.getDate();
        const monthFr = monthsFr[date.getMonth()];
        const year = date.getFullYear();

        return `${dayFr} ${dayNumber} ${monthFr} ${year}`;
    }
};