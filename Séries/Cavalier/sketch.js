class ChessBoard {
  constructor(size, knightPos = { x: 0, y: 0 }) {
    this.size = size
    this.startKnight = knightPos //position initiale
    this.knight = this.startKnight //knight est un object x,y
  }
  //toujours relatives a la position du cavalier.
  possibleKnightMoves = [
    { x: 1, y: 2 },
    { x: 2, y: 1 },
    { x: 1, y: -2 },
    { x: 2, y: -1 },
    { x: -1, y: 2 },
    { x: -2, y: 1 },
    { x: -1, y: -2 },
    { x: -2, y: -1 }
  ]

  knightCoordinates() {
    let coordinates = []

    //fonction qui renvoie un tableau des différents déplacements possibles a une position
    //donnée du cavalier. (knight définit dans la classe {x,y}).
    this.possibleKnightMoves.forEach((move) => {
      const coord = { x: this.knight.x + move.x, y: this.knight.y + move.y }
      //si c'est pas en dehors
      if (0 <= coord.x && coord.x < this.size && 0 <= coord.y && coord.y < this.size)
        coordinates.push(coord) //on les prends
    })
    
    return coordinates
  }

  knightRandomWalk(updateCallback) {
    for (let i = 1; true; i++) {
      const coordinates = this.knightCoordinates()
      //on choisit une nouvelle direction a prendre.
      this.knight = coordinates[Math.floor(Math.random() * coordinates.length)]
      updateCallback(this.knight)
      //si on est de retour au point de départ.
      if (this.knight.x == this.startKnight.x && this.knight.y == this.startKnight.y) {
        return i //on renvoie le nombre de coups.
      }
    }
  }
}

const board = new ChessBoard(8);

let lastVisitedCase = board.startKnight;
//tableau des cases visitées avec le nombre de visites.
let valueArray = [{ node: board.startKnight, count: 1 }];

let maxCount = 1;
let caseWidth;
let caseHeight;

function setup() {
  createCanvas(400, 400);
  caseWidth = Math.floor(width / board.size)
  caseHeight = Math.floor(height / board.size)
}

function updateCallback(knight) {
    //on dessine les lignes entre les cases précédentes.
    line((lastVisitedCase.x + 1) * caseWidth - caseWidth / 2, 
            (lastVisitedCase.y + 1) * caseHeight - caseHeight / 2,
            (knight.x + 1) * caseWidth - caseWidth / 2, 
            (knight.y + 1) * caseHeight - caseHeight / 2 )

    lastVisitedCase = knight

    //si cette case a déjà étée visitée
    const index = valueArray.findIndex(el => el.node.x == knight.x && el.node.y == knight.y)
    if (index < 0) {
        valueArray.push({ node: knight, count: 1 })
        return;
    }
    //si on a visité plus qu'un certain seuil ce sera noir.
    if (++valueArray[index].count > maxCount)
        maxCount = valueArray[index].count
}

function draw() {
  background(200);

  //dessine les lignes horizontales
  for (let i = 1; i < board.size; i++) {
    line(0, i * caseHeight, width, i * caseHeight)
  }
  //dessine les lignes verticales.
  for (let j = 1; j < board.size; j++) {
    line(j * caseWidth, 0, j * caseWidth, height)
  }

  //simulations
  n = 10000;
  values = []
  let coups = 0;
  //values est un tableau de n simulations (un nb de coups à chaque fois)
  for(let i=0; i < n; i++) {
    let tmp = board.knightRandomWalk(updateCallback)
    values.push(tmp)
    coups += tmp
  }
  //nombre de coups moyens, (loi faible des grands nombres !)
  console.log(coups/n)

  //ce code affiche les cercles sur l'échiquier.
  valueArray.forEach((value) => {
    fill(value.count / maxCount * 255, 0, 0) //on mets une couleur de plus en plus foncée.
    circle(value.node.x * caseWidth + (caseWidth / 2), value.node.y * caseHeight + (caseHeight / 2),
      caseWidth < caseHeight ? caseWidth / 2 : caseHeight / 2)
  })
  
  let nb;
  //on trie en ordre croissant
  values.sort((a, b) => { return a - b })
  let max = values[values.length - 1]
  //on instantie un tableau de taille maximale.
  let newArray = Array(max)

  //ceci est une implémentation d'un bincount rudimentaire.
  //avec chaque valeur values[i] on compte son nombre
  //d'apparitions dans le tableau values et on mets ce nombre
  //dans un nouveau tableau a la position values[i].
  for(let i=0; i < n; i++) {
    nb = 0
    for(let k=0; k < n; k++) {
      if(values[k] === values[i] && i != k) {
        nb = nb + 1; //tmp compte le nb de fois que values[i] apparaît
      }
    }
    //splicer au lieu d'assignement, car wtfjs
    //passe tout par référence.
    newArray.splice(values[i], 0, nb);
  }
  //on vire les valeur sur la fin qui n'ont aucun sens.
  newArray.splice(800, newArray.length - 800);

  //on crée les vecteurs x, y
  x = []
  y = []
  for(let i=0; i < newArray.length; i++) {
    x[i] = i;
    if(newArray[i] === undefined) {
      y[i] = 0;
    } else {
        y[i] = newArray[i];
    }
  }
  
  //on plot le résultat.
  test = document.getElementById('tester');
  Plotly.newPlot( test, [{
  x:x, y:y }], 
  {
    title: {
        text:"Nombre de retours en fonction du nombre de coups.",
        font: {
            family: "Times New Roman",
            size: 24
        },
    },
    xaxis: {
        title: {
            text: "nombre de coups",
            font: {
                family: "Times New Roman",
                size: 18,
                color: "#7f7f7f"
            }
        }
    },
    yaxis: {
        title: {
            text: "Nombres d'occurences",
            font: {
                family: "Times New Roman",
                size: 18,
                color: "#7f7f7f"
            }
        }
    }
});
  noLoop()
}