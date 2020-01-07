function fancySum() {
    let sum = 0;

    for (let i = 0; i < arguments.length; i++)
        sum += arguments[i];

    function add() {
        for (let i = 0; i < arguments.length; i++)
            sum += arguments[i];
        return add
    }

    add.toString = () => sum;

    return add
}


// https://stackoverflow.com/questions/18252084/closure-in-javascript-with-multiple-brackets
