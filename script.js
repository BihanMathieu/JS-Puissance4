let player = 'player2';
let redToken = [];
let yellowToken = [];
let victory = false;
let table = document.createElement('table');


puissance4();

/**
 * Lance la partie
 */
function puissance4(){
  createTable(6,7)
  game()
}

  /**
   * Fabrique le tableau de jeu
   * @param {*} rows nombre de lignes
   * @param {*} cols nombre de colonnes
   */
  function createTable(rows, cols){
    for (let i = 0; i < rows; i++) {
      let tr = table.appendChild(document.createElement('tr'));
      for (let j = 0; j < cols; j++) {
        let td = tr.appendChild(document.createElement('td'));
        td.cellIndex = [i, j]
      }
    }
    let game = document.getElementById('game');
    game.appendChild(table);
  }

  /**
   * Fait passer les tours et place les jetons
   */
  function game(){
    const td = document.querySelectorAll('td');
    td.forEach(cell => {
      cell.addEventListener('click', () => {
        if(!victory){
          let column = cell.cellIndex;
          if (player == 'player2') {
            gameStage('player1', 'red', column, redToken);
          } else {
            gameStage('player2', 'yellow', column, yellowToken);
          }
        }
        restart()
      });
    });
  }
  

/**
 * Défini les actions a faire pour chaque tour d'un joueur
 * @param {*} playerTurn joueur actuelle
 * @param {*} color couleur associer au joueur actuelle
 * @param {*} column position de la colonne jouer
 * @param {*} tokenArray tableau qui regroupe la position des jetons
 */
function gameStage(playerTurn, color, column, tokenArray) {
  let verificationTokenPlacement = verificationColumn(player, tokenArray, column);
  if (typeof verificationTokenPlacement != null) {
    player = playerTurn;
    createPiece(color, verificationTokenPlacement, column);
  }
  victoryCheck(tokenArray,color);
}


/**
 * Verifie si il y a deja des jetons dans la colonne.Retourn null si la colonne et rempli
 * Sinon rentre les coordonné du jeton [x,y] le plus haut dans le tableau et retourne le x.
 * @param {*} currentPlayer Le joueur actuellement en trein de jouer
 * @param {*} tokenArray le tableau ou seront rentrer les coordonées
 * @param {*} colomnNumber le numéro de la colonne qui a été jouée
 * @returns 
 */
function verificationColumn(currentPlayer, tokenArray, colomnNumber) {
  let highestPosition;
  if (yellowToken.concat(redToken).filter(pos => pos[1] === colomnNumber) == 0) {
    highestPosition = [6, colomnNumber]
  } else {
    highestPosition = yellowToken.concat(redToken)
      .filter(pos => pos[1] === colomnNumber)
      .reduce((acc, current) => acc[0] < current[0] ? acc : current);
  }
  if (highestPosition[0] <= 0) {
    console.log("Ne peux pas jouer");
    player = currentPlayer
    document.getElementById("victory").innerHTML = "La colone est pleine";
    return null
  } else {
    tokenArray.push([highestPosition[0] - 1, colomnNumber]);
    document.getElementById("victory").innerHTML = "";
    return highestPosition[0] - 1
  }
}


/**
 * Crée un nouveau jeton a partir des coordonnées fourni et lui applique un style
 * @param {*} color la couleur du joueur
 * @param {*} x coordonées
 * @param {*} y coordonées
 */
function createPiece(color, x, y) {
  let newPiece = table.rows[x].cells[y];
  newPiece.style.backgroundColor = color;
  newPiece.style.boxShadow = 'inset 0px 0px 20px 4px black'

}

/**
 * Fonction qui vérifie si il y a victoire
 * @param {*} tokenArray tableau qui regroupe la position des jetons
 * @param {*} color couleur du joueur
 */
function victoryCheck(tokenArray, color) {
  const positions = tokenArray.map(([x, y]) => x * 10 + y);
  const checkers = [1, 10, 9, 11];

  for (const position of positions) {
    for (const direction of checkers) {
      const values = Array.from({ length: 4 }, (_, i) => position + i * direction);
      if (values.every((value) => positions.includes(value))) {
        document.getElementById("victory").innerHTML = `${color} victory !!!`;
        victory = true;
      }
    }
  }
}

/**
 * Remet le jeu aux conditions de départ
 */
function restart(){
  const td = document.querySelectorAll('td');
  let restart = document.getElementById('restart');
  restart.addEventListener('click', () => {
    for(let i= 0; i < td.length; i++){
      td[i].style.backgroundColor = 'white'
      td[i].style.boxShadow = 'none'
    }
    player = 'player2';
    redToken = [];
    yellowToken = [];
    victory = false;
    document.getElementById("victory").innerHTML = "";
  });
}
