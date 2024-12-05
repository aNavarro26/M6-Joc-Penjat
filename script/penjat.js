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
let paraulaArray;
let encertsConsecutius = 0;
let letra;
let haGuanyat = false;
let hoEs = false;
let aparicions = 0;
let paraulaSecretaFetch = '';

const Puntuacio = {
    totalPartides: 0,

    jugador1: {
        puntsActuals: 0,
        partidesGuanyades: 0,
        maximPunts: { punts: 0, date: '' }
    },
    jugador2: {
        puntsActuals: 0,
        partidesGuanyades: 0,
        maximPunts: { punts: 0, date: '' }
    },
    getPartides: function () {
        return this.totalPartides;
    },

};

let punts = [0, 0];

let jugador = 0;

const loadButtons = function () {
    fetch("http://127.0.0.1:5500/res/alfabet_cat.json")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error al carregar el fitxer JSON");
            }
            return response.json();
        })
        .then((data) => {
            const letters = data.alfabet; // Llista de lletres del JSON
            const divBttns = document.getElementById("divBttns");
            divBttns.innerHTML = ""; // Per assegurar-me que no hi ha res

            for (let i = 0; i < letters.length; i++) {
                const button = document.createElement("button");
                button.classList.add("bttnLetters");
                button.textContent = letters[i];
                button.disabled = true;
                // funció expresiva perquè no es pot passar per paràmetre ja que s'executaría
                button.addEventListener("click", function () {
                    useChar(button);
                });
                divBttns.appendChild(button);
            }
        })
        .catch((error) => {
            console.error("Error al carregar l'alfabet:", error);
        });
};

function startGame() {
    guionsString = '';
    inputParaulaObject = document.getElementById("inputParaula");
    startGameDivObject.style.backgroundColor = '#294936';

    // Comprovo que l'input sigui correcte
    validateInput();

    // Posar els guions a la variable i a l'objecte HTML 
    insertGuions(paraulaArray);

    // Habilitar tots els botons
    enableButtons();

    // Bloquejar el input i el botó d'inici
    inputParaulaObject.disabled = true;
    startGameBttnObject.disabled = true;

    document.getElementById('gameStatus').style.color = 'green';
    document.getElementById('gameStatus2').style.color = 'red';

    // Reseteo els punts
    punts[0] = 0;
    punts[1] = 0;
    document.getElementById('puntsActuals').textContent = punts[0];
    document.getElementById('puntsActuals2').textContent = punts[1];

    encertsConsecutius = 0;
    jugades = 0;
}



function updateGameStatus() {
    // Jugador 1
    document.getElementById('puntsActuals').textContent = punts[0];

    // Jugador 2
    document.getElementById('puntsActuals2').textContent = punts[1];
}

function updateGameStatus() {
    // Jugador 1
    document.getElementById('puntsActuals').textContent = Puntuacio.jugador1.puntsActuals;

    // Jugador 2
    document.getElementById('puntsActuals2').textContent = Puntuacio.jugador2.puntsActuals;
}

function sumarPunts(numCaracters) {
    encertsConsecutius++;
    Puntuacio['jugador' + (jugador + 1)].puntsActuals += encertsConsecutius * numCaracters;
    updateGameStatus();
    console.log(`Jugador ${jugador + 1} acertó una letra, sumando ${encertsConsecutius * numCaracters} puntos.`);
}

function restarPunts() {
    encertsConsecutius = 0;
    Puntuacio['jugador' + (jugador + 1)].puntsActuals = Math.max(0, Puntuacio['jugador' + (jugador + 1)].puntsActuals - 1);
    updateGameStatus();
    console.log(`Jugador ${jugador + 1} falló, restando 1 punto y reseteando racha.`);
}


function mostrarParaula() {
    if (inputParaulaObject.type === "password") {
        inputParaulaObject.type = "text";
        // canvio la classe per a que així canvi el icon per al ull obert o tancat
        eyeIconObject.classList.remove("fa-eye");
        eyeIconObject.classList.add("fa-eye-slash");
    } else {
        inputParaulaObject.type = "password";
        eyeIconObject.classList.remove("fa-eye-slash");
        eyeIconObject.classList.add("fa-eye");
    }
}

function validateInput() {
    if (!inputParaulaObject.value && paraulaSecretaFetch) {
        paraulaSecreta = paraulaSecretaFetch; // Usa la palabra del fetch si no res al input
        console.log("No hi ha paraula al input. Usant la palabra del fetch:", paraulaSecreta);
    } else if (!inputParaulaObject.value) {
        alert("Has d'afegir una paraula per poder començar a jugar");
        return;
    }
    else if (/\d/.test(inputParaulaObject.value)) { // compruebo con regex si hay digitos en el input
        alert("No pot haver números a la paraula");
        return;
    }
    else if (inputParaulaObject.value.length <= 3) {
        alert("La paraula ha de contenir més de 3 caràcters");
        return;
    }
    else {
        paraulaSecreta = inputParaulaObject.value; // Usa la palabra del input
    }

    inputParaulaObject.disabled = true;
    startGameBttnObject.disabled = true;
    paraulaArray = paraulaSecreta.split('');
    startGameLblObject.textContent = guionsString;
    startGameLblObject.style.letterSpacing = '1.6vw';
}

const enableButtons = function () {
    document.querySelectorAll(".bttnLetters").forEach((button) => {
        button.disabled = false;
        button.classList.remove("disabledButton");
        button.classList.add("enabledButton");
    });
};

const disableButtons = function () {
    const buttons = document.querySelectorAll(".bttnLetters");
    if (buttons.length === 0) {
        console.error("No se han encontrado botones con la clase 'bttnLetters'.");
        return;
    }
    buttons.forEach((button) => {
        button.disabled = true;
        button.classList.remove("enabledButton");
        button.classList.add("disabledButton");
    });
    console.log("Todos los botones han sido deshabilitados.");
};

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
    console.log("Verificant lletra:", letra);

    for (let index = 0; index < paraulaSecreta.length; index++) {
        if (paraulaSecreta[index].toUpperCase() === letra.toUpperCase()) {
            hoEs = true;
            aparicions++;
            updateGuions(index, letra);
        }
    }

    console.log("La lletra está en la paraula?", hoEs);
    console.log("Aparicions de la lletra:", aparicions);

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

function updatePlayerColor() {

    // canvio el color depenent de qui té el torn
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

function finalizarPartida(haGuanyat) {
    if (haGuanyat) {
        if (jugador === 0) {
            Puntuacio.jugador1.partidesGuanyades++;
        } else {
            Puntuacio.jugador2.partidesGuanyades++;
        }
        startGameDivObject.style.backgroundColor = 'green';
    } else {
        startGameDivObject.style.backgroundColor = 'red';
    }

    // Mostrar punts actuals del jugador correcte
    if (jugador === 0) {
        console.log(`Punts actuals del jugador 1: ${Puntuacio.jugador1.puntsActuals}`);
    } else {
        console.log(`Punts actuals del jugador 2: ${Puntuacio.jugador2.puntsActuals}`);
    }

    // Actualitzar la millor partida
    if (jugador === 0 && Puntuacio.jugador1.puntsActuals > Puntuacio.jugador1.maximPunts.punts) {
        const data = new Date().toLocaleString('ca-ES');
        Puntuacio.jugador1.maximPunts = { punts: Puntuacio.jugador1.puntsActuals, date: data };
        Puntuacio.totalPartides++;
        console.log(`Millor partida actualitzada: ${Puntuacio.jugador1.maximPunts.punts} punts el ${Puntuacio.jugador1.maximPunts.date}`);
    } else if (jugador === 1 && Puntuacio.jugador2.puntsActuals > Puntuacio.jugador2.maximPunts.punts) {
        const data = new Date().toLocaleString('ca-ES');
        Puntuacio.jugador2.maximPunts = { punts: Puntuacio.jugador2.puntsActuals, date: data };
        Puntuacio.totalPartides++;
        console.log(`Millor partida actualitzada: ${Puntuacio.jugador2.maximPunts.punts} punts el ${Puntuacio.jugador2.maximPunts.date}`);
    }

    // Actualitzar estadístiques al DOM
    document.getElementById('totalPartides').textContent = Puntuacio.totalPartides;
    document.getElementById('totalPartides2').textContent = Puntuacio.totalPartides;

    updateGameStatus();

    // Fer el percentatge de les partides guanyades
    const porcentajeGanadas1 = Puntuacio.totalPartides > 0
        ? ((Puntuacio.jugador1.partidesGuanyades / Puntuacio.totalPartides) * 100).toFixed(2)
        : '0';

    document.getElementById('partidesGuanyades').textContent = `${Puntuacio.jugador1.partidesGuanyades} (${porcentajeGanadas1}%)`;
    if (Puntuacio.jugador1.maximPunts.punts) {
        document.getElementById('partidaMesPunts').textContent = `${Puntuacio.jugador1.maximPunts.date} - ${Puntuacio.jugador1.maximPunts.punts} punts`;
    } else {
        document.getElementById('partidaMesPunts').textContent = '- 0 punts';
    }

    const porcentajeGanadas2 = Puntuacio.totalPartides > 0
        ? ((Puntuacio.jugador2.partidesGuanyades / Puntuacio.totalPartides) * 100).toFixed(2)
        : '0';

    document.getElementById('partidesGuanyades2').textContent = `${Puntuacio.jugador2.partidesGuanyades} (${porcentajeGanadas2}%)`;
    if (Puntuacio.jugador2.maximPunts.punts) {
        document.getElementById('partidaMesPunts2').textContent = `${Puntuacio.jugador2.maximPunts.date} - ${Puntuacio.jugador2.maximPunts.punts} punts`;
    } else {
        document.getElementById('partidaMesPunts2').textContent = '- 0 punts';
    }

    // Deshabilitar els botons
    disableButtons();

    // Permet escriure una nova paraula i habilitar el botó d'inici
    inputParaulaObject.disabled = false;
    startGameBttnObject.disabled = false;

    console.log("La partida ha finalitzat. Botons deshabilitats. Es pot escriure una nova paraula.");
}



window.onload = function () {
    loadButtons();

    fetch("http://127.0.0.1:5500/res/exemple.json")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error al carregar el fitxer JSON");
            }
            return response.json();
        })
        .then((data) => {
            const segonObjecte = data.tematiques[1];
            const nom = segonObjecte.nom;
            const terceraParaula = segonObjecte.paraules[2];

            console.log(`Nom: ${nom}`);
            console.log(`Tercera paraula: ${terceraParaula}`);
            paraulaSecretaFetch = terceraParaula; // Guarda la paraula del fetch
        })
        .catch((error) => {
            console.error("Error:", error);
        });
};