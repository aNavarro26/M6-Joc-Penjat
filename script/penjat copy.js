// TODO: Gif machetazo

// Objects
const eyeIconObject = document.getElementById("togglePassword");
const inputParaulaObject = document.getElementById("inputParaula");
const startGameBttnObject = document.getElementById("startGameBttn");
const startGameLblObject = document.getElementById("startGameLbl");
const startGameDivObject = document.getElementById("startGameDiv");


let imageObject = document.getElementById("imageStatus");
let paraulaSecreta = '';
let guionsArray = [];
let guionsString = '';
let jugades = 0;
let srcImage = "src/penjat_0.jpg";

let puntsActuals = 0;
let encertsConsecutius = 0;
let totalPartides = 0;
let partidesGuanyades = 0;
let partidaMesPunts = { punts: 0, data: '' };

let puntsActuals2 = 0;
let totalPartides2 = 0;
let partidesGuanyades2 = 0;
let partidaMesPunts2 = { punts: 0, data: '' };

let totalPartidesGenerals = 0;



let currentPlayer = 1;
const players = [
    { punts: 0, encertsConsecutius: 0, totalPartides: 0, partidesGuanyades: 0, partidaMesPunts: { punts: 0, data: '' } },
    { punts: 0, encertsConsecutius: 0, totalPartides: 0, partidesGuanyades: 0, partidaMesPunts: { punts: 0, data: '' } }
];

function updateGameStatus() {
    document.getElementById('puntsActuals').textContent = players[0].punts;
    document.getElementById('totalPartides').textContent = players[0].totalPartides;
    document.getElementById('partidesGuanyades').textContent = `${players[0].partidesGuanyades} (${((players[0].partidesGuanyades / players[0].totalPartides) * 100).toFixed(2)}%)`;
    document.getElementById('partidaMesPunts').textContent = players[0].partidaMesPunts.punts ? `${players[0].partidaMesPunts.data} - ${players[0].partidaMesPunts.punts} punts` : '- 0 punts';

    document.getElementById('puntsActuals2').textContent = players[1].punts;
    document.getElementById('totalPartides2').textContent = players[1].totalPartides;
    document.getElementById('partidesGuanyades2').textContent = `${players[1].partidesGuanyades} (${((players[1].partidesGuanyades / players[1].totalPartides) * 100).toFixed(2)}%)`;
    document.getElementById('partidaMesPunts2').textContent = players[1].partidaMesPunts.punts ? `${players[1].partidaMesPunts.data} - ${players[1].partidaMesPunts.punts} punts` : '- 0 punts';

    // Jugador 1
    document.getElementById('puntsActuals').textContent = puntsActuals;
    document.getElementById('totalPartides').textContent = totalPartides;
    document.getElementById('partidesGuanyades').textContent = `${partidesGuanyades} (${((partidesGuanyades / totalPartides) * 100).toFixed(2)}%)`;
    document.getElementById('partidaMesPunts').textContent = partidaMesPunts.punts ? `${partidaMesPunts.data} - ${partidaMesPunts.punts} punts` : '- 0 punts';

    // Jugador 2
    document.getElementById('puntsActuals2').textContent = puntsActuals2;
    document.getElementById('totalPartides2').textContent = totalPartides2;
    document.getElementById('partidesGuanyades2').textContent = `${partidesGuanyades2} (${((partidesGuanyades2 / totalPartides2) * 100).toFixed(2)}%)`;
    document.getElementById('partidaMesPunts2').textContent = partidaMesPunts2.punts ? `${partidaMesPunts2.data} - ${partidaMesPunts2.punts} punts` : '- 0 punts';

    // Actualizar total de partides generals si es necesario
    document.getElementById('totalPartidesGenerals').textContent = totalPartidesGenerals;

}

function updatePlayerColor() {
    document.getElementById('gameStatus').style.color = currentPlayer === 1 ? 'green' : 'red';
    document.getElementById('gameStatus2').style.color = currentPlayer === 2 ? 'green' : 'red';
}


function sumarPunts(numCaracters) {
    players[currentPlayer - 1].encertsConsecutius++;
    players[currentPlayer - 1].punts += players[currentPlayer - 1].encertsConsecutius * numCaracters;
    updateGameStatus();
    console.log(`Jugador ${currentPlayer} acertó una letra, sumando ${players[currentPlayer - 1].encertsConsecutius * numCaracters} puntos.`);
}

function restarPunts() {
    players[currentPlayer - 1].encertsConsecutius = 0;
    players[currentPlayer - 1].punts = Math.max(0, players[currentPlayer - 1].punts - 1);
    updateGameStatus();
    console.log(`Jugador ${currentPlayer} falló, restando 1 punto y reseteando racha.`);
}


function mostrarParaula() {
    if (inputParaulaObject.type === "password") {
        inputParaulaObject.type = "text";
        eyeIconObject.classList.remove("fa-eye");
        eyeIconObject.classList.add("fa-eye-slash");
    } else {
        inputParaulaObject.type = "password";
        eyeIconObject.classList.remove("fa-eye-slash");
        eyeIconObject.classList.add("fa-eye");
    }
}

function validateInput() {
    if (!inputParaulaObject.value) {
        alert("Has d'afegir una paraula per poder començar a jugar");
    }
    else if (/\d/.test(inputParaulaObject.value)) {
        alert("No pot haver números a la paraula");
    }
    else if (inputParaulaObject.value.length <= 3) {
        alert("La paraula ha de contenir més de 3 caràcters");
    }
    else {
        inputParaulaObject.disabled = true;
        startGameBttnObject.disabled = true;
        startGameLblObject.textContent = guionsString;
        startGameLblObject.style.letterSpacing = '1.6vw';
    }
}

function enableButtons() {
    for (let i = 1; i <= 26; i++) {
        const button = document.getElementById(`bttn${i}`);
        button.disabled = false;
        button.style.border = "2px solid black";
        button.style.color = "black";
    }
}

function disableButtons() {
    for (let i = 1; i <= 26; i++) {
        const button = document.getElementById(`bttn${i}`);
        button.disabled = true;
        button.style.border = "2px solid red";
        button.style.color = "red";
    }
}

function disableSingleButton(button) {
    button.disabled = true;
    button.style.border = "2px solid red";
    button.style.color = "red";
}


function insertGuions(paraulaArray) {
    guionsArray = [];

    paraulaArray.forEach(() => {
        guionsArray.push('_');
    });

    guionsString = guionsArray.join('');

    console.log(guionsString);

    startGameLblObject.textContent = guionsString;
}

function updateGuions(index, letra) {
    guionsArray[index] = letra;
    guionsString = guionsArray.join('');
    startGameLblObject.textContent = guionsString;

    if (guionsString.indexOf('_') === -1) {
        console.log("usuari ha guanyat");
        finalizarPartida(true);
    }
}

function startGame() {
    validateInput();
    enableButtons();
    startGameDivObject.style.backgroundColor = '#294936';
    paraulaSecreta = inputParaulaObject.value;
    paraulaArray = paraulaSecreta.split('');
    insertGuions(paraulaArray);
    updatePlayerColor();

    // Reset stats for new game
    players[currentPlayer - 1].punts = 0;
    players[currentPlayer - 1].encertsConsecutius = 0;
    jugades = 0;
}


function checkChar(letra) {
    let hoEs = false;
    let aparicions = 0;
    console.log("Verificando letra:", letra);
    for (let index = 0; index < paraulaSecreta.length; index++) {
        let char = paraulaSecreta[index];
        if (char.toUpperCase() === letra.toUpperCase()) {
            hoEs = true;
            aparicions++;
            updateGuions(index, letra);
        }
    }
    console.log("La letra está en la palabra?", hoEs);
    console.log("Apariciones de la letra:", aparicions);
    if (hoEs) {
        sumarPunts(aparicions);
    }
    return { hoEs, aparicions };
}

function useChar(button) {
    let letra = button.textContent;
    let haGuanyat = false;

    const { hoEs, aparicions } = checkChar(letra);

    if (!hoEs) {
        jugades++;
        srcImage = `src / penjat_${jugades}.jpg`;
        imageObject.src = srcImage;
        restarPunts();
        if (jugades === 10) {
            startGameDivObject.style.backgroundColor = 'red';
            imageObject.src = "src/penjat_11.gif";
            disableButtons();
            finalizarPartida(false);
            return;  //
        } else {
            currentPlayer = currentPlayer === 1 ? 2 : 1;
        }
    } else {
        if (aparicions > 0 && guionsString.indexOf('_') === -1) {
            haGuanyat = true;
        }
    }

    updatePlayerColor();
    disableSingleButton(button);

    if (haGuanyat) {
        finalizarPartida(true);
    }
}


function finalizarPartida(haGuanyat) {
    // Incrementar solo si totalPartidesGenerals aún no coincide con la suma de partidas de los jugadores
    const totalPartidesActuals = players[0].totalPartides + players[1].totalPartides;

    players[currentPlayer - 1].totalPartides++;

    if (haGuanyat) {
        players[currentPlayer - 1].partidesGuanyades++;
        startGameDivObject.style.backgroundColor = 'green';
    } else {
        startGameDivObject.style.backgroundColor = 'red';
    }

    console.log(`Puntos actuales del jugador ${currentPlayer}: ${players[currentPlayer - 1].punts} `);
    console.log(`Mejor partida antes de actualizar: ${players[currentPlayer - 1].partidaMesPunts.punts} puntos el ${players[currentPlayer - 1].partidaMesPunts.data} `);

    if (players[currentPlayer - 1].punts > players[currentPlayer - 1].partidaMesPunts.punts) {
        const data = new Date().toLocaleString('ca-ES');
        players[currentPlayer - 1].partidaMesPunts = { punts: players[currentPlayer - 1].punts, data: data };
        console.log(`Mejor partida actualizada a: ${players[currentPlayer - 1].partidaMesPunts.punts} puntos el ${players[currentPlayer - 1].partidaMesPunts.data} `);
    }

    updateGameStatus();
    disableButtons();  // Deshabilitar botones al finalizar la partida
    console.log("La partida ha finalizado. Los botones se han deshabilitado.");
    console.log(`Total de partidas generales: ${totalPartidesGenerals} `);
}


function resetGame() {
    // Reset game-specific variables
    puntsActuals = 0;
    puntsActuals2 = 0;
    encertsConsecutius = 0;
    jugades = 0;
    srcImage = "src/penjat_0.jpg";

    document.getElementById('imageStatus').src = srcImage;
    inputParaulaObject.disabled = false;
    startGameBttnObject.disabled = false;
    startGameLblObject.textContent = "";
    startGameLblObject.style.letterSpacing = 'normal';
    inputParaulaObject.value = "";
    paraulaSecreta = '';
    guionsArray = [];
    guionsString = '';

    updateGameStatus();  // Update display without altering persistent stats
}