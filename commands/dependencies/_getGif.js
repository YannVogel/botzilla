const random = require('./_getRandomInt');

const lowValues = [
    "https://media.giphy.com/media/3o6nVaYi6WuWiQAQEw/giphy.gif",
    "https://media.giphy.com/media/iqkUhBIdNOetJWXtNx/giphy.gif",
    "https://i.giphy.com/media/vKwAAw1AM2mkw/200.webp",
    "https://i.giphy.com/media/3o6UB5RrlQuMfZp82Y/200.webp",
    "https://i.giphy.com/media/Km2YiI2mzRKgw/200.webp",
    "https://i.giphy.com/media/3ohuPkgbcIaG2OoDIs/100.webp",
    "https://i.giphy.com/media/3ohze3cqkv058SUy2s/giphy.webp"
];

const okValues = [
    "https://i.giphy.com/media/l3diOsCPt5TUMMYX6/200.webp",
    "https://i.giphy.com/media/KiGMzfSIrNf0s/giphy.webp",
    "https://media.giphy.com/media/l41YoVcd7UhOWIDBK/giphy.gif",
    "https://media.giphy.com/media/yYrYPXatpCMiA/giphy.gif",
    "https://media.giphy.com/media/l0MYResEdNIyniuL6/giphy.gif",
    "https://media.giphy.com/media/jt38YxwGTevEkFWWoY/giphy.gif",
    "https://i.giphy.com/media/Hidva3NC6BulW/giphy.webp",
    "https://media.giphy.com/media/5u0uZecUZlUsM/giphy.gif",
    "https://media.giphy.com/media/H0uLRCd8JIhRS/giphy.gif",
    "https://media.giphy.com/media/SZzvURrhr26Ws/giphy.gif",
    "https://media.giphy.com/media/14SAx6S02Io1ThOlOY/giphy.gif"
];

const mediumValues = [
    "https://i.giphy.com/media/xTiTnqUxyWbsAXq7Ju/giphy.webp",
    "https://i.giphy.com/media/ESt8At0PXpmj6/giphy.webp",
    "https://i.giphy.com/media/13ln9K5TWkNTLa/giphy.webp",
    "https://media.giphy.com/media/SsTcO55LJDBsI/giphy.gif",
    "https://media.giphy.com/media/72HahsJD4atSE/giphy.gif",
    "https://i.giphy.com/media/z7W3Ljw7oslTq/giphy.webp",
    "https://i.giphy.com/media/2VYui7kj5C5I4/giphy.webp",
    "https://media.giphy.com/media/3oFzmqENRBkRTRfLcA/giphy.gif",
    "https://media.giphy.com/media/l46CeWQMHheP4gaXK/giphy.gif",
    "https://media.giphy.com/media/k4iuvHyjOVtzq/giphy.gif"
];

const mediumPlusValues = [
    "https://i.giphy.com/media/i7vxmJ4rjSkcE/giphy.webp",
    "https://i.giphy.com/media/KA8NKtxyZFh72/giphy.webp",
    "https://i.giphy.com/media/YZGJc1WmUZPi0/giphy.webp",
    "https://i.giphy.com/media/xT1XGzAnABSXy8DPCU/giphy.webp",
    "https://i.imgur.com/pqGR8D6.mp4"
];

const highValues = [
    "https://i.giphy.com/media/wb6xgCSpLl0m4/giphy.webp",
    "https://i.giphy.com/media/Xy2PrQq6BIw7u/giphy.webp",
    "https://media.giphy.com/media/la6Ne7z15BXs4/giphy.gif"
];

const reallyHighValues = [
    "https://i.giphy.com/media/3o8dFzIXb0qaE3pYWs/giphy.webp",
    "https://media.giphy.com/media/zz1v8vjwQwTja/giphy.gif"
];

const cursedBag = [
    "https://media.giphy.com/media/j9AqaIVJyiJxu/giphy.gif",
    "https://media.giphy.com/media/OV7OqX4BRufmM/giphy.gif",
    "https://media.giphy.com/media/3ov9k9kmfD1b80NJ2o/giphy.gif",
    "https://media.giphy.com/media/8jUeyfpMF6gj6/giphy.gif",
    "https://media.giphy.com/media/104v6Qd66phU3u/giphy.gif",
    "https://i.giphy.com/media/I45vYOHGvWK2I/giphy.webp",
    "https://media.giphy.com/media/h5NLPVn3rg0Rq/giphy.gif",
    "https://media.giphy.com/media/loozMQ9jKFvoY/giphy.gif",
    "https://media.giphy.com/media/l0O9xUwpOWJSxxK7e/giphy.gif",
    "https://media.giphy.com/media/3o7aTt4H9aTXFxUvgQ/giphy.gif",
    "https://media.giphy.com/media/3oEduMQtGMYpPf0KHe/giphy.gif",
    "https://media.giphy.com/media/3ohs4dUDl3TEKdp3pu/giphy.gif",
    "https://media.giphy.com/media/3o7TKDjPLgtGDFMkmI/giphy.gif"
];

const perfectCursedBag = [
    "https://media.giphy.com/media/xT9IgvEOwRzUcZDRiU/giphy.gif",
    "https://media.giphy.com/media/u7YEhhfif3m7u/giphy.gif",
    "https://media.giphy.com/media/x3gWRgW7OBuF2/giphy.gif",
    "https://media.giphy.com/media/qcsbQyayfac80/giphy.gif",
    "https://media.giphy.com/media/26ueZTKUP9sQ8eQFO/giphy.gif"
];

module.exports = {
    getMoneyBagGif: (bagValor) => {
        //If the bag has a "low" value...
        if(bagValor <= 50)
        {
            return lowValues[random.getRandomInt(lowValues.length)];
        }
        //If the bag has a "ok" value...
        if(bagValor <= 100)
        {
            return okValues[random.getRandomInt(okValues.length)];
        }
        //If the bag has a "medium" value...
        if(bagValor <= 500)
        {
            return mediumValues[random.getRandomInt(mediumValues.length)];
        }
        //If the bag has a "medium+" value...
        if(bagValor <= 750)
        {
            return mediumPlusValues[random.getRandomInt(mediumPlusValues.length)];
        }
        //If the bag has a "high" value...
        if(bagValor <= 1000)
        {
            return highValues[random.getRandomInt(highValues.length)];
        }
        // Otherwise, the bag has a "really high" value...
        return reallyHighValues[random.getRandomInt(reallyHighValues.length)];
    },
    getCursedBagGif: (percentage) => {
        // If 1 <= percentage <= 24...
        if(percentage !== 25)
        {
            return cursedBag[random.getRandomInt(cursedBag.length)];
        }
        // Otherwise, percentage === 25 (the highest possible value)...
        return perfectCursedBag[random.getRandomInt(perfectCursedBag.length)];

    }
};