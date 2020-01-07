const url = 'http://127.0.0.1:5000/';

class Card {
    constructor(card, color, div, deleteBTN, editBTN, par, pin, id, pinned) {
        this.color = color;
        this.div = div;
        this.deleteBTN = deleteBTN;
        this.editBTN = editBTN;
        this.id = id;
        this.par = par;
        this.pin = pin;
        this.pinned = pinned;
        this.card = card;
        this.delete(div, this);
        this.edit(this);
        this.pinning(div, this);
    }

    delete(div, card) {
        this.deleteBTN.onclick = function () {
            div.style.display = 'none';
            cards.splice(cards.indexOf(card), 1);
            fetch(url + 'cards/' + card.id, {method: 'DELETE'});
        }
    }

    edit(card) {
        this.editBTN.onclick = function () {
            hideExtraInputs('block');
            secondInput.value = card.par.innerText;
            selectedCard = card;
        }
    }

    pinning(card, obj) {
        this.pin.onclick = function () {
            if (pinnedCard !== undefined) {
                pinnedCard.childNodes[1].style.visibility = 'hidden';
                let temp = document.createElement("div");
                let firstChild = card.parentNode.firstChild;
                card.parentNode.insertBefore(temp, card);
                card.parentNode.insertBefore(card, firstChild);
                temp.parentNode.insertBefore(firstChild, temp);
                temp.parentNode.removeChild(temp);
                pinnedCard = card;
                localStorage.setItem('card', JSON.stringify(obj));
                card.childNodes[1].style.visibility = 'visible';
                return
            }
            let element = card.parentNode.childNodes[0];
            card.parentNode.insertBefore(card, element);
            pinnedCard = card;
            localStorage.setItem('card', JSON.stringify(obj));
            pinnedCard.childNodes[1].style.visibility = 'visible';
        }
    }
}

let plus = document.getElementById('plus');
let input = document.getElementById('input');
let colorPicker = document.getElementById('color_selector');
let secondInput = document.getElementById('input2');
let secondPlus = document.getElementById('plus2');
let secondColorPicker = document.getElementById('color_selector2');
let cards = [];
let selectedCard;
let pinnedCard;

plus.onmouseenter = function () {
    plus.style.opacity = '100%'
};

plus.onmouseleave = function () {
    plus.style.opacity = '50%'
};

plus.onclick = function () {
    let text = input.value;
    if (text.split(' ')[0] === '')
        return;
    let color = colorPicker.value;
    let li = document.createElement('li');
    let div = document.createElement('div');
    let par = document.createElement('p');
    let del = document.createElement('div');
    let edit = document.createElement('div');
    let pin = document.createElement('div');
    let pinned = document.createElement('div');
    let inputting = {title: text, color: color};
    fetch(url + 'cards/', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(inputting)
    }).then(value => value.json()).then(value => {
        let id = value['_id'];
        addClass(div, ['card']);
        addClass(del, ['delete']);
        addClass(edit, ['edit']);
        addClass(pin, ['pin']);
        addClass(pinned, ['pinned']);
        addChild(div, [par]);
        addChild(li, [div, pinned, del, edit, pin]);
        addChild(document.getElementById('ul'), [li]);
        par.innerHTML = text;
        div.style.background = `${color}`;
        cards.push(new Card(div, color, li, del, edit, par, pin, id, pinned));
        input.value = '';
    });
};

input.onkeypress = function (e) {
    if (e.keyCode === 13)
        plus.onclick();
};

secondPlus.onclick = function () {
    if (selectedCard === null || selectedCard === undefined)
        return;
    let text = secondInput.value;
    let color = secondColorPicker.value;
    selectedCard.card.style.background = `${color}`;
    selectedCard.par.innerText = text;
    fetch(url + 'cards/' + selectedCard.id, {
        method: 'PUT',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({'title': text, 'color': color})
    });
    selectedCard = null;
    hideExtraInputs('none');
};

function hideExtraInputs(res) {
    [
        document.getElementById('input2'),
        document.getElementById('plus2'),
        document.getElementById('color_selector2'),
    ].forEach(function (i) {
        i.style.display = res;
    })
}

function addChild(node, children) {
    for (let i = 0; i < children.length; i++)
        node.appendChild(children[i]);

}

function addClass(node, classes) {
    for (let i = 0; i < classes.length; i++)
        node.classList.add(classes[i]);
}

(function createCards() {
    fetch(url + 'cards', {method: 'GET'}).then(value => value.json()).then(value => {
        for (let i = value.cards.length - 1; i >= 0; i--) {
            let element = value.cards[i];
            let text = element['title'];
            let color = element['color'];
            let id = element['_id'];
            let li = document.createElement('li');
            let div = document.createElement('div');
            let par = document.createElement('p');
            let del = document.createElement('div');
            let edit = document.createElement('div');
            let pin = document.createElement('div');
            let pinned = document.createElement('div');
            addClass(div, ['card']);
            addClass(del, ['delete']);
            addClass(edit, ['edit']);
            addClass(pin, ['pin']);
            addClass(pinned, ['pinned']);
            addChild(div, [par]);
            addChild(li, [div, pinned, del, edit, pin]);
            addChild(document.getElementById('ul'), [li]);
            par.innerHTML = text;
            div.style.background = `${color}`;
            let card = new Card(div, color, li, del, edit, par, pin, id, pinned);
            cards.push(card);
            input.value = '';
        }
    })
})();

setTimeout(function () {
    let card = localStorage.getItem('card');
    if (card === null)
        return;
    card = JSON.parse(card);
    for (let i = 0; i < cards.length; i++) {
        if (cards[i] === undefined)
            continue;
        if (cards[i].id === card.id) {
            cards[i].pin.onclick();
            return;
        }
    }

}, 500);