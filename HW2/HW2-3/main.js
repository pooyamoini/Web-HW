let shapeOfEachPaper = parseInt(prompt('Enter Dimension of each Ground : '));
let numberToWin = parseInt(prompt('Enter number of beads to Win : '));
let turn = 0;
let start = Date.now(), timerVar = document.getElementById('timer');
let beadIsClicked = false;
let groundIsRotated = false;
let degrees = [0, 0, 0, 0];

let luBeads = new Array(shapeOfEachPaper);
let ldBeads = new Array(shapeOfEachPaper);
let ruBeads = new Array(shapeOfEachPaper);
let rdBeads = new Array(shapeOfEachPaper);

let lu = document.getElementById('lu');
let ld = document.getElementById('ld');
let ru = document.getElementById('ru');
let rd = document.getElementById('rd');

document.getElementById('playground').style.width = (shapeOfEachPaper * 120) + 'px';
document.getElementById('playground').style.height = (shapeOfEachPaper * 120) + 'px';
document.getElementById('up').style.width = (shapeOfEachPaper * 120) + 'px';
document.getElementById('down').style.width = (shapeOfEachPaper * 120) + 'px';
document.getElementById('rotate').style.width = (shapeOfEachPaper * 120) + 'px';


function addChildesToNode(node, array) {

    for (let i = 0; i < shapeOfEachPaper; i++) {
        array[i] = new Array(shapeOfEachPaper);
        for (let j = 0; j < shapeOfEachPaper; j++) {
            let bead = document.createElement('div');
            node.appendChild(bead);
            bead.style.width = (95 / (2 * shapeOfEachPaper)) + '%';
            bead.style.height = (95 / (2 * shapeOfEachPaper)) + '%';
            bead.className = 'bead';
            bead.onmouseenter = function () {
                if (bead.style.backgroundColor === 'white' || bead.style.backgroundColor === 'black')
                    return;
                bead.style.opacity = '50%';
            };
            bead.onmouseout = function () {
                bead.style.opacity = '100%';
            };
            array[i][j] = bead;
        }
    }
}

(function () {
    addChildesToNode(lu, luBeads);
    addChildesToNode(ld, ldBeads);
    addChildesToNode(ru, ruBeads);
    addChildesToNode(rd, rdBeads);
})();

for (let i = 0; i < document.getElementsByClassName('up').length; i++) {
    document.getElementsByClassName('up')[i].style.marginBottom = (shapeOfEachPaper * 120) + 'px';
    document.getElementsByClassName('up')[i].style.marginTop = '43px';
}

for (let i = 0; i < document.getElementsByClassName('arrow').length; i++) {
    document.getElementsByClassName('arrow')[i].style.display = 'flex';
    document.getElementsByClassName('arrow')[i].style.fontSize = `${shapeOfEachPaper * 3.1 + 2}px`;
    document.getElementsByClassName('arrow')[i].onmouseenter = function () {
        document.getElementsByClassName('arrow')[i].style.opacity = '100%';
    };
    document.getElementsByClassName('arrow')[i].onmouseout = function () {
        document.getElementsByClassName('arrow')[i].style.opacity = '50%';
    }
}

for (let i = 0; i < document.getElementsByClassName('bead').length; i++) {
    let bead = document.getElementsByClassName('bead')[i];
    bead.onclick = onClickBeads(bead);
}

function changeTimerColor() {
    if (turn % 2 === 0) {
        document.getElementById('timer').style.color = 'black';
        for (let i = 0; i < document.getElementsByClassName('arrow').length; i++)
            document.getElementsByClassName('arrow')[i].style.color = 'black';
        return
    }
    document.getElementById('timer').style.color = 'white';
    for (let i = 0; i < document.getElementsByClassName('arrow').length; i++)
        document.getElementsByClassName('arrow')[i].style.color = 'white';
}

function onClickBeads(beadFunc) {
    function action() {
        if (beadFunc.style.backgroundColor === 'black' || beadFunc.style.backgroundColor === 'white') {
            alert('cannot click on duplicate bead');
            return
        }
        if (beadIsClicked && !groundIsRotated) {
            alert('you already clicked');
            return;
        }
        beadIsClicked = true;
        if (turn % 2 === 0) {
            beadFunc.style.backgroundColor = 'black';
            if (groundIsRotated) {
                clearTimeout(actionFirstPlayer);
                actionSecondPlayer = setTimeout(actionTurn, 10000, 1);
            }
        } else {
            beadFunc.style.backgroundColor = 'white';
            if (groundIsRotated) {
                clearTimeout(actionSecondPlayer);
                actionFirstPlayer = setTimeout(actionTurn, 10000, 0);
            }
        }
        findWinner();
        if (isGameFinish()) {
            alert('DRAW :)');
            location.reload();
        }
        if (beadIsClicked && groundIsRotated) {
            beadIsClicked = false;
            groundIsRotated = false;
            turn++;
            changeTimerColor();
            start = Date.now();
        }
    }

    return action;
}

(function timer() {
    (function f() {
        let diff = Date.now() - start, ns = (((1.1e4 - diff) / 1e3) >> 0), m = (ns / 60) >> 0, s = ns - m * 60;
        timerVar.textContent = m + ':' + (('' + s).length > 1 ? '' : '0') + s;
        if (diff > 1.1e4)
            start = Date.now();
        setTimeout(f, 0);
    })();
})();

let actionFirstPlayer = setTimeout(actionTurn, 10000, 0);
let actionSecondPlayer;

function actionTurn(player) {

    if (player === 0) {
        if (!groundIsRotated)
            randomRotate();

        if (!beadIsClicked)
            returnEmptyBeads().style.backgroundColor = 'black';

        clearTimeout(actionFirstPlayer);
        actionSecondPlayer = setTimeout(actionTurn, 10000, 1);
    } else {
        if (!groundIsRotated)
            randomRotate();

        if (!beadIsClicked)
            returnEmptyBeads().style.backgroundColor = 'white';

        clearTimeout(actionSecondPlayer);
        actionFirstPlayer = setTimeout(actionTurn, 10000, 0);
    }
    groundIsRotated = false;
    beadIsClicked = false;
    findWinner();
    turn++;
    changeTimerColor();
    start = Date.now();
}

function randomRotate() {
    let r = Math.floor(Math.random() * (3 + 1));
    let dom;
    let array;
    switch (r) {
        case 0:
            dom = document.getElementById('lu');
            array = luBeads;
            break;
        case 1:
            dom = document.getElementById('ru');
            array = ruBeads;
            break;
        case 2:
            dom = document.getElementById('ld');
            array = ldBeads;
            break;
        case 3:
            dom = document.getElementById('rd');
            array = rdBeads;
            break;
    }
    rotateAnimate(r, dom, 90);
    rotateCW(array);
}

function returnEmptyBeads() {
    let min = Math.ceil(0);
    let max = Math.floor(3);
    let valueRandom = Math.floor(Math.random() * (max - min + 1)) + min;
    let currentBead;
    switch (valueRandom) {
        case 0:
            currentBead = luBeads;
            break;
        case 1:
            currentBead = ldBeads;
            break;
        case 2:
            currentBead = ruBeads;
            break;
        case 3:
            currentBead = rdBeads;
            break;
        default:
            currentBead = ruBeads;
            break
    }
    max = Math.floor(shapeOfEachPaper - 1);
    let i = Math.floor(Math.random() * (max - min + 1)) + min;
    let j = Math.floor(Math.random() * (max - min + 1)) + min;
    if (currentBead[i][j].style.backgroundColor !== 'white' && currentBead[i][j].style.backgroundColor !== 'black')
        return currentBead[i][j];
    return returnEmptyBeads();
}

function isGameFinish() {
    return turn >= (4 * (shapeOfEachPaper ** 2)) - 1;
}

function findWinner() {
    let ground = concatGrounds();
    let uLG = upLeftGround(ground);
    let bRG = bottomRightGround(ground);
    for (let i = 0; i < ground.length; i++)
        countColors(ground[i]);

    for (let i = 0; i < ground.length; i++) {
        const arrayColumn = (arr, n) => arr.map(x => x[n]);
        let column = arrayColumn(ground, i);
        countColors(column);
    }
    for (let i = 0; i < uLG.length; i++) {
        countColors(uLG[i]);
        countColors(bRG[i]);
    }
}

function countColors(list) {
    for (let i = 0; i < list.length; i++) {
        if (i === list.length - 1)
            break;
        let temp = 1;
        let variable = list[i].style.backgroundColor;
        if (variable !== 'black' && variable !== 'white')
            continue;
        while (list[i + 1].style.backgroundColor === variable) {
            i++;
            temp++;
            if (i >= list.length - 1)
                break;
        }
        if (variable === 'black' && temp >= numberToWin) {
            for (let j = i; j >= (i - numberToWin + 1); j--)
                list[j].classList.add('blink');
            setTimeout(function () {
                alert('first player win the game :)');
                location.reload();
            }, 4000);
        }

        if (variable === 'white' && temp >= numberToWin) {
            for (let j = i; j >= (i - numberToWin + 1); j--)
                list[j].classList.add('blink');
            setTimeout(function () {
                alert('second player win the game :)');
                location.reload();
            }, 4000);
        }
    }
}

function concatGrounds() {
    let concat = new Array(2 * shapeOfEachPaper);
    for (let i = 0; i < concat.length; i++) {
        concat[i] = new Array(2 * shapeOfEachPaper);
        if (i < shapeOfEachPaper) {
            concat[i] = [...luBeads[i], ...ruBeads[i]];
        } else {
            concat[i] = [...ldBeads[i - shapeOfEachPaper], ...rdBeads[i - shapeOfEachPaper]];
        }
    }
    return concat;
}

function upLeftGround(ground) {
    let temp;
    let array1 = new Array(2 * (2 * shapeOfEachPaper - 1));
    for (let k = 0; k <= 2 * (2 * shapeOfEachPaper - 1); ++k) {
        temp = [];
        for (let y = 2 * shapeOfEachPaper - 1; y >= 0; --y) {
            let x = k - y;
            if (x >= 0 && x < 2 * shapeOfEachPaper) {
                temp.push(ground[y][x]);
            }
        }
        array1[k] = temp;
    }
    return array1;
}

function bottomRightGround(ground) {
    let temp;
    let array1 = new Array(2 * ((2 * shapeOfEachPaper) - 1));
    for (let k = 0; k <= 2 * ((2 * shapeOfEachPaper) - 1); ++k) {
        temp = [];
        for (let y = (2 * shapeOfEachPaper) - 1; y >= 0; --y) {
            const x = k - ((2 * shapeOfEachPaper - 1) - y);
            if (x >= 0 && x < (2 * shapeOfEachPaper)) {
                temp.push(ground[y][x]);
            }
        }
        array1[k] = temp;
    }
    return array1;
}

function rotate(dom, i, angle, matrix) {
    return function () {
        if (groundIsRotated) {
            alert('already done :)');
            return;
        }
        groundIsRotated = true;
        rotateAnimate(i, dom, angle);
        if (angle > 0)
            rotateCW(matrix);
        else
            rotateCCW(matrix);
        if (groundIsRotated && beadIsClicked) {
            if (turn % 2 === 0) {
                clearTimeout(actionFirstPlayer);
                actionSecondPlayer = setTimeout(actionTurn, 10000, 1);
            } else {
                clearTimeout(actionSecondPlayer);
                actionFirstPlayer = setTimeout(actionTurn, 10000, 1);
            }
            beadIsClicked = false;
            groundIsRotated = false;
            turn++;
            changeTimerColor();
            start = Date.now();
        }
    }
}

function rotateCW(matrix) {
    const n = matrix.length;
    const x = Math.floor(n / 2);
    const y = n - 1;
    for (let i = 0; i < x; i++) {
        for (let j = i; j < y - i; j++) {
            let k = matrix[i][j];
            matrix[i][j] = matrix[y - j][i];
            matrix[y - j][i] = matrix[y - i][y - j];
            matrix[y - i][y - j] = matrix[j][y - i];
            matrix[j][y - i] = k;
        }
    }
}

function rotateCCW(matrix) {
    let n = matrix.length;
    for (let i = 0; i < n / 2; i++) {
        for (let j = i; j < n - i - 1; j++) {
            let tmp = matrix[i][j];
            matrix[i][j] = matrix[j][n - i - 1];
            matrix[j][n - i - 1] = matrix[n - i - 1][n - j - 1];
            matrix[n - i - 1][n - j - 1] = matrix[n - j - 1][i];
            matrix[n - j - 1][i] = tmp;
        }
    }
}

document.getElementById('luu').onclick = rotate(document.getElementById('lu'), 0, 90, luBeads);
document.getElementById('lud').onclick = rotate(document.getElementById('lu'), 0, -90, luBeads);
document.getElementById('ruu').onclick = rotate(document.getElementById('ru'), 1, 90, ruBeads);
document.getElementById('rud').onclick = rotate(document.getElementById('ru'), 1, -90, ruBeads);
document.getElementById('ldu').onclick = rotate(document.getElementById('ld'), 2, 90, ldBeads);
document.getElementById('ldd').onclick = rotate(document.getElementById('ld'), 2, -90, ldBeads);
document.getElementById('rdu').onclick = rotate(document.getElementById('rd'), 3, 90, rdBeads);
document.getElementById('rdd').onclick = rotate(document.getElementById('rd'), 3, -90, rdBeads);


function rotateAnimate(i, dom, degree) {
    let classCSS;
    if (degree > 0)
        classCSS = 'rotatingCW';
    else classCSS = 'rotatingCCW';
    dom.classList.add(classCSS);
    let previous = degrees[i];
    degrees[i] += degree;
    setTimeout(function () {
        dom.classList.remove(classCSS);
        dom.style.transform = `rotate(${degrees[i]}deg)`
    }, 1000);
    let style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `\
@keyframes ${classCSS}1 {\
    0% {\
       transform: rotate(${previous}deg);\
    }\
    100% {\
       transform: rotate(${degrees[i]}deg);\
    }\
}`;
    document.getElementsByTagName('head')[0].appendChild(style);
}

