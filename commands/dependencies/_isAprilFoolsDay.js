function isAprilFoolsDay() {
    const date = new Date();
    return date.getMonth() === 3 && date.getDate() === 1;

}
module.exports = {
    isAprilFoolsDay
};