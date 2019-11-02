let view = {
    //метод получает строковое сообщение и выводит его в области сообщений
    displayMessage(msg) {
        const messageArea = document.querySelector('div#messageArea');
        messageArea.innerHTML = msg;
    },
    displayHit(location) {
        const cell = document.getElementById(location);
        cell.setAttribute('class', 'hit');

    },
    displayMiss(location) {
        const cell = document.getElementById(location);
        cell.setAttribute('class', 'miss');
    }
};

let model = {
    boardSize: 7,
    numShips: 3,
    shipSunk: 0,
    shipLength: 3,
    // основной метод. Создает в модели массив ships с количеством кораблей, определяемым свойством numShips модели.
    generateShipLocations() {
        let locations;
        for (let i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip();
            } while (this.collision(locations));
            this.ships[i].locations = locations;
        }
    },
    //метод создает один корабль, находящийся в произвольном месте игрового поля
    generateShip() {
        let direction = Math.floor(Math.random() * 2);
        let row, col;
        if (direction === 1) {
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
        } else {
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
            col = Math.floor(Math.random() * this.boardSize);
        }
        let newShipLocations = [];
        for (let i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                newShipLocations.push(row + '' + (col + i));
            } else {
                newShipLocations.push((row + i) + '' + col);
            }
        }
        return newShipLocations;
    },
    collision(locations) {
        for (let i = 0; i < this.numShips; i++) {
            let ship = model.ships[i];
            for (let j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true;
                }
            }
        }
        return false;
    },
    ships: [{locations: [0, 0, 0], hits: ["", "", ""]},
        {locations: [0, 0, 0], hits: ["", "", ""]},
        {locations: [0, 0, 0], hits: ["", "", ""]}],
    fire(guess) {
        for (let i = 0; i < this.numShips; i++) {
            let ship = this.ships[i];
            let index = ship.locations.indexOf(guess);
            if (index >= 0) {
                ship.hits[index] = 'hit';
                view.displayHit(guess);
                view.displayMessage('HIT!');
                if (this.isSunk(ship)) {
                    view.displayMessage('You sank my battleship!');
                    this.shipSunk++
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage('You missed.');
        return false;
    },
    isSunk(ship) {
        for (let i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== 'hit') {
                return false;
            }
        }
        return true;
    }
};

let controller = {
    guesses: 0,
    processGuess(guess) {
        let location = parseGuess(guess);
        if (location) {
            this.guesses++;
            let hit = model.fire(location);
            if (hit && model.shipSunk === model.numShips) {
                view.displayMessage('You sank all my battleships, in ' + this.guesses + ' guesses');
            }
        }
    }
};

function parseGuess(guess) {
    const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    if (guess === null || guess.length !== 2) {
        alert('Oops, please enter a letter and number on the board.');
    } else {
        let firstChar = guess.charAt(0);
        let row = alphabet.indexOf(firstChar);
        let column = guess.charAt(1);
        if (isNaN(row) || isNaN(column)) {
            alert("Oops, that isn't on the board.");
        } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
            alert("Oops, that's off the board!");
        } else {
            return row + column;
        }
    }
    return null;
}

function init() {
    let fireButton = document.querySelector('#fireButton');
    fireButton.onclick = handleFireButton;
    let guessInput = document.querySelector('#guessInput');
    guessInput.onkeypress = handleKeyPress;
    model.generateShipLocations();
}

function handleFireButton() {
    let guessInput = document.querySelector('#guessInput');
    let guess = guessInput.value;
    guess = guess.toUpperCase();
    controller.processGuess(guess);
    guessInput.value = '';
}

function handleKeyPress(e) {
    let fireButton = document.querySelector('#fireButton');
    if (e.keyCode === 13) {
        fireButton.click();
        return false;
    }
}

window.onload = init;
