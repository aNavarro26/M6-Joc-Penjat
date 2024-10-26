// TODO: Arreglar problema partidas 2

// TODO: Comentarios

// Objects
const eyeIconObject = document.getElementById("togglePassword");
let inputParaulaObject = document.getElementById("inputParaula");
const startGameBttnObject = document.getElementById("startGameBttn");
const startGameLblObject = document.getElementById("startGameLbl");
const startGameDivObject = document.getElementById("startGameDiv");
let imageObject = document.getElementById("imageStatus");

// Variables
let paraulaSecreta = '';
let guionsArray = [];
let guionsString = '';
let jugades = 0;
let srcImage = "src/penjat_0.jpg";
let paraulaArray;
let encertsConsecutius = 0;
let letra;
let haGuanyat = false;
let hoEs = false;
let aparicions = 0;


// Jugador 1
let puntsActuals = 0;
let totalPartides = -1;
let partidesGuanyades = -1;
let partidaMesPunts = { punts: 0, data: '' };
let porcentajeGanadas;


// Jugador 2
let puntsActuals2 = 0;
let totalPartides2 = -1;
let partidesGuanyades2 = -1;
let partidaMesPunts2 = { punts: 0, data: '' };
let porcentajeGanadas2;

let punts = [0, 0];

let jugador = 0;

function startGame() {
    guionsString = '';
    inputParaulaObject = document.getElementById("inputParaula");
    startGameDivObject.style.backgroundColor = '#294936';
    // comprovo que l'input sigui correcte
    validateInput();
    // poso els guions a la variable i a l'objecte HTML 
    insertGuions(paraulaArray);
    // habilito tots els botons
    enableButtons();
    document.getElementById('gameStatus').style.color = 'green';
    document.getElementById('gameStatus2').style.color = 'red';

    // reseteo els punts
    punts[0] = 0;
    punts[1] = 0;
    document.getElementById('puntsActuals').textContent = punts[0];
    document.getElementById('puntsActuals').textContent = punts[1];

    encertsConsecutius = 0;
    jugades = 0;
}


function updateGameStatus() {
    // Jugador 1
    document.getElementById('puntsActuals').textContent = punts[0];

    // Jugador 2
    document.getElementById('puntsActuals2').textContent = punts[1];
}

function updatePlayerColor() {

    // cambio el color dependiendo de quien tiene el turno
    if (jugador === 0) {
        document.getElementById('gameStatus').style.color = 'red';
    } else {
        document.getElementById('gameStatus').style.color = 'green';
    }

    if (jugador === 1) {
        document.getElementById('gameStatus2').style.color = 'red';
    } else {
        document.getElementById('gameStatus2').style.color = 'green';
    }
}


function sumarPunts(numCaracters) {
    encertsConsecutius++;
    punts[jugador] += encertsConsecutius * numCaracters;
    updateGameStatus();
    // per a poder usar variables i expressions en el log
    console.log(`Jugador ${jugador + 1} acertó una letra, sumando ${encertsConsecutius * numCaracters} puntos.`);
}

function restarPunts() {
    encertsConsecutius = 0;
    punts[jugador] = Math.max(0, punts[jugador] - 1); // per a que no passi de 0
    updateGameStatus();
    console.log(`Jugador ${jugador + 1} falló, restando 1 punto y reseteando racha.`);
}

function mostrarParaula() {
    if (inputParaulaObject.type === "password") {
        inputParaulaObject.type = "text";
        // canvio la classe per a que així canviï el icon per al ull obert o tancat
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
    else if (/\d/.test(inputParaulaObject.value)) { // compruebo con regex si hay digitos en el input
        alert("No pot haver números a la paraula");
    }
    else if (inputParaulaObject.value.length <= 3) {
        alert("La paraula ha de contenir més de 3 caràcters");
    }
    else {
        inputParaulaObject.disabled = true;
        startGameBttnObject.disabled = true;
        paraulaSecreta = inputParaulaObject.value;
        paraulaArray = paraulaSecreta.split('');
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

    // per cada element de l'array,inserto a guionsArray un _
    paraulaArray.forEach(() => {
        guionsArray.push('_');
    });

    // passo l'array a string
    guionsString = guionsArray.join('');

    console.log(guionsString);

    startGameLblObject.textContent = guionsString;
}

function updateGuions(index, letra) {
    guionsArray[index] = letra;
    guionsString = guionsArray.join('');
    startGameLblObject.textContent = guionsString;

    // si no ha més _ significa que ha guanyat ja
    if (guionsString.indexOf('_') === -1) {
        console.log("usuari ha guanyat");
        finalizarPartida(true);
    }
}


function useChar(button) {
    letra = button.textContent;
    haGuanyat = false;

    hoEs = false;
    aparicions = 0;
    console.log("Verificando letra:", letra);

    for (let index = 0; index < paraulaSecreta.length; index++) {
        if (paraulaSecreta[index].toUpperCase() === letra.toUpperCase()) {
            hoEs = true;
            aparicions++;
            updateGuions(index, letra);
        }
    }

    console.log("La letra está en la palabra?", hoEs);
    console.log("Apariciones de la letra:", aparicions);

    if (hoEs) {
        sumarPunts(aparicions);
        disableSingleButton(button);
        if (guionsString.indexOf('_') === -1) { // si no hi ha més -, significa que la paraula ha sigut descoberta ja
            haGuanyat = true;
        }
    } else {
        jugades++;
        imageObject.src = `src/penjat_${jugades}.jpg`; // per anar canviant l'imatge
        restarPunts();
        updatePlayerColor();
        disableSingleButton(button);

        if (jugades === 10) { // ha perdut
            startGameDivObject.style.backgroundColor = 'red';
            imageObject.src = "src/penjat_11.gif";
            disableButtons();
            finalizarPartida(false);
            return; // surto de la funció per a que no la siga
        } else {
            if (jugador === 0) {
                jugador = 1;
            } else {
                jugador = 0;
            }

        }
    }

    if (haGuanyat) {
        startGameDivObject.style.backgroundColor = 'green';
        disableButtons();
        finalizarPartida(true);
    }
}


function finalizarPartida(haGuanyat) {
    if (haGuanyat) {
        // per veure qui jugador ha guanyat
        if (jugador === 0) {
            partidesGuanyades++;
        } else {
            partidesGuanyades2++;
        }
        startGameDivObject.style.backgroundColor = 'green';
    } else {
        startGameDivObject.style.backgroundColor = 'red';
    }

    console.log(`Puntos actuales del jugador ${jugador + 1}: ${punts[jugador]}`);

    // Actualitzar la millor partida
    if (jugador === 0 && punts[0] > partidaMesPunts.punts) {
        const data = new Date().toLocaleString('ca-ES');
        partidaMesPunts = { punts: punts[0], data: data };
        totalPartides++;
        console.log(`Mejor partida actualizada: ${partidaMesPunts.punts} puntos el ${partidaMesPunts.data}`);
    } else if (jugador === 1 && punts[1] > partidaMesPunts2.punts) {
        const data = new Date().toLocaleString('ca-ES');
        partidaMesPunts2 = { punts: punts[1], data: data };
        totalPartides2++;
        console.log(`Mejor partida actualizada: ${partidaMesPunts2.punts} puntos el ${partidaMesPunts2.data}`);
    }

    document.getElementById('totalPartides').textContent = totalPartides;
    document.getElementById('totalPartides2').textContent = totalPartides;

    updateGameStatus();

    // hacer el porcentaje de las partidas ganadas
    if (totalPartides > 0) {
        porcentajeGanadas = ((partidesGuanyades / totalPartides) * 100).toFixed(2); // limito a 2 decimales
    } else {
        porcentajeGanadas = '0';
    }

    document.getElementById('partidesGuanyades').textContent = `${partidesGuanyades} (${porcentajeGanadas}%)`;
    if (partidaMesPunts.punts) {
        document.getElementById('partidaMesPunts').textContent = `${partidaMesPunts.data} - ${partidaMesPunts.punts} punts`;
    } else {
        document.getElementById('partidaMesPunts').textContent = '- 0 punts';
    }

    if (totalPartides2 > 0) {
        porcentajeGanadas2 = ((partidesGuanyades2 / totalPartides2) * 100).toFixed(2);
    } else {
        porcentajeGanadas2 = '0';
    }

    document.getElementById('partidesGuanyades2').textContent = `${partidesGuanyades2} (${porcentajeGanadas2}%)`;
    if (partidaMesPunts2.punts) {
        document.getElementById('partidaMesPunts2').textContent = `${partidaMesPunts2.data} - ${partidaMesPunts2.punts} punts`;
    } else {
        document.getElementById('partidaMesPunts2').textContent = '- 0 punts';
    }
    disableButtons();
    inputParaulaObject.disabled = false;
    startGameBttnObject.disabled = false;
    console.log("La partida ha finalizado. Los botones se han deshabilitado.");
}