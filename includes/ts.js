module.exports.timestamp = function (date) {
    if (date == undefined) {
        var date = new Date();
    }
    var year = date.getFullYear(),
        month = date.getMonth(),
        day = date.getDate(),
        hour = date.getHours(),
        minutes = date.getMinutes(),
        seconds = date.getSeconds(),
        milliseconds = date.getMilliseconds();

    return (year +
        ((month < 10) ? '0' + (month + 1) : month) +
        ((day < 10) ? '0' + day : day) +
        '-' +
        ((hour < 10) ? '0' + hour : hour) +
        ':' +
        ((minutes < 10) ? '0' + minutes : minutes) +
        ':' +
        ((seconds < 10) ? '0' + seconds : seconds) +
        '.' +
        ('00' + milliseconds).slice(-3));
};