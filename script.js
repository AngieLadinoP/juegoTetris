let canvas = document.getElementById("canva")
let ctx = canvas.getContext('2d')

//Number of columns and rows the board will have 
const COLS = 10;
const ROWS = 20;
// Block size: it is a square, width and height are going to be the same 
const BLOCK_SIZE = 25;
//Color of squares that are not taken by any figure
const EMPTY = "#EFEFEF";
//Variable of Score
const scoreElement = document.getElementById("score");

//Draw the sq of the board
function drawSq(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    ctx.strokeStyle = "white";
    ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}


//Create the board
let board = [];
for (r = 0; r < ROWS; r++) {
    board[r] = [];
    for (c = 0; c < COLS; c++) {
        board[r][c] = EMPTY;
    }
}

//Draw the board
function drawBoard() {
    for (r = 0; r < ROWS; r++) {
        for (c = 0; c < COLS; c++) {
            drawSq(c, r, board[r][c])
        }
    }
}
drawBoard();

//Define the pieces and the positions they have
const I = [
    [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ],
    [
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
    ]
];

const J = [
    [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 1, 1],
        [0, 1, 0],
        [0, 1, 0]
    ],
    [
        [0, 0, 0],
        [1, 1, 1],
        [0, 0, 1]
    ],
    [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0]
    ]
];

const L = [
    [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1]
    ],
    [
        [0, 0, 0],
        [1, 1, 1],
        [1, 0, 0]
    ],
    [
        [1, 1, 0],
        [0, 1, 0],
        [0, 1, 0]
    ]
];

const O = [
    [
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0],
    ]
];

const S = [
    [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],
    [
        [0, 1, 0],
        [0, 1, 1],
        [0, 0, 1]
    ]
];

const T = [
    [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 1, 0],
        [0, 1, 1],
        [0, 1, 0]
    ],
    [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0]
    ],
    [
        [0, 1, 0],
        [1, 1, 0],
        [0, 1, 0]
    ]
];

const Z = [
    [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 0, 1],
        [0, 1, 1],
        [0, 1, 0]
    ]
];

//Array with pieces and their colors
const PIECES = [
    [Z, "#22363D"],
    [S, "#045775"],
    [T, "#D9BDA0"],
    [O, "#BA674E"],
    [L, "#8F1D13"],
    [I, "#6B735A"],
    [J, "#5D8AA6"]
];


//Generate random pieces. Choose a random number that will be the index to select the piece from the array
function randomPiece() {
    let ranPiece = Math.floor(Math.random() * PIECES.length) //Index position to select figure from array of pieces
    return new Piece(PIECES[ranPiece][0], PIECES[ranPiece][1]) // selected figure and its color as parameters of the object: Piece 
}

let p = randomPiece();

//The object piece
function Piece(figure, color) {
    this.figure = figure;
    this.color = color;

    //We start from the first position of the figure 
    this.figureN = 0; // Index for the array of positions of each piece
    this.actFigure = this.figure[this.figureN]; // selected figure in a specific position

    //Define the location of the pieces when they appear on the board for the firs time
    this.x = 3; // the image appears in the center
    this.y = -2; //The image is over the board and starts falling
}
/* In order to move the figure (left, right, down) we need to:
 - Evaluate future position of the figure to know if threre are any collisions
 - Undraw the current figure
 - Move the figure's coordinates to the desire place
 - Draw the figure
 */



//fill function
Piece.prototype.fill = function(color) {
    for (r = 0; r < this.actFigure.length; r++) { // Array's rows  of the figure's specific position 
        for (c = 0; c < this.actFigure.length; c++) { // Array's columns  of the figure's specific position 
            //We draw only the occupied sq
            if (this.actFigure[r][c]) { // each square in the array of the specific position of the figure true=1 false=0
                drawSq(this.x + c, this.y + r, color);
            }
        }
    }
}

//Draw a piece to the board
Piece.prototype.draw = function() {
    this.fill(this.color);
}

//Undraw a piece
Piece.prototype.unDraw = function() {
    this.fill(EMPTY);
}

//Move down the piece
Piece.prototype.moveDown = function() {
        if (!this.collision(0, 1, this.actFigure)) {
            this.unDraw();
            this.y++;
            this.draw();
        } else {
            //We look the piece and generate a new one
            this.lock();
            p = randomPiece();
        }
    }
    //Move right the piece
Piece.prototype.moveRight = function() {
        if (!this.collision(1, 0, this.actFigure)) {
            this.unDraw();
            this.x++;
            this.draw();
        }
    }
    //Move left the piece
Piece.prototype.moveLeft = function() {
        if (!this.collision(-1, 0, this.actFigure)) {
            this.unDraw();
            this.x--;
            this.draw();
        }
    }
    //Rotate the piece
Piece.prototype.rotate = function() {
    let nextPat = this.figure[(this.figureN + 1) % this.figure.length]; // Increment the figure number 
    let kick = 0;

    if (this.collision(0, 0, nextPat)) {
        if (this.x > COLS / 2) { // Collision in the right wall
            kick = -1; //We need to move the piece to the left
        } else {
            kick = 1; //We need to move the piece to the right
        }
    }

    if (!this.collision(kick, 0, nextPat)) {
        this.unDraw();
        this.x += kick;
        this.figureN = (this.figureN + 1) % this.figure.length;
        this.actFigure = this.figure[this.figureN]; // selected figure in a specific position
        this.draw();
    }
}

let score = 0;


// Lock the piece when it reaches the end or when it is over another figure
Piece.prototype.lock = function() {
    for (r = 0; r < this.actFigure.length; r++) { // Array's rows  of the figure's specific position 
        for (c = 0; c < this.actFigure.length; c++) { // Array's columns  of the figure's specific position 
            //We skip the empty sq
            if (!this.actFigure[r][c]) {
                continue;
            }
            // pieces to lock on top = game over
            if (this.y + r < 0) {
                alert("Game Over");
                //Stop request animation frame
                gameOver = true;
                break;
            }

            //We lock the piece
            board[this.y + r][this.x + c] = this.color; //To lock it, we just need to draw the squares of the figure on the board
        }
    }

    //Remove full rows and add points to the score 
    for (r = 0; r < ROWS; r++) {
        let isRowFull = true;
        for (c = 0; c < COLS; c++) {
            isRowFull = isRowFull && (board[r][c] != EMPTY); // The row is full, all of the sq are taken and have a color
        }
        if (isRowFull) {
            // if the row is full
            // we move down all the rows above it
            for (y = r; y > 1; y--) {
                for (c = 0; c < COLS; c++) {
                    board[y][c] = board[y - 1][c];
                }
            }
            // the top row board[0][..] has no row above it
            for (c = 0; c < COLS; c++) {
                board[0][c] = EMPTY;
            }
            // increment the score for each full row
            score += 10;
        }
    }
    // update the board
    drawBoard();
    // update the score
    scoreElement.innerHTML = score;
}

// collision function
Piece.prototype.collision = function(x, y, piece) {
    for (r = 0; r < piece.length; r++) { //Check all the squares of the figure
        for (c = 0; c < piece.length; c++) {
            // if the square is empty within the piece array, we skip it
            if (!piece[r][c]) {
                continue;
            }
            // coordinates of the piece after movement
            let newX = this.x + c + x;
            let newY = this.y + r + y;

            // conditions
            if (newX < 0 || newX >= COLS || newY >= ROWS) { // Collision due to the canva's margin
                return true;
            }
            // skip newY < 0; board[-1] will crush our game because there is not index with -1
            if (newY < 0) {
                continue;
            }
            // check if there is a locked piece alrady in place
            if (board[newY][newX] != EMPTY) {
                return true;
            }
        }
    }
    return false;
}

// Control the piece
document.addEventListener("keydown", CONTROL);

function CONTROL(event) {
    if (event.key == "ArrowLeft") {
        p.moveLeft();
        dropStart = Date.now();
    } else if (event.key == "ArrowUp") {
        p.rotate();
        dropStart = Date.now();
    } else if (event.key == "ArrowRight") {
        p.moveRight();
        dropStart = Date.now();
    } else if (event.key == "ArrowDown") {
        p.moveDown();
    }
}

//Drop the piece every half second 
let dropStart = Date.now(); //returns the number of milliseconds 
let gameOver = false;

function drop() {
    let now = Date.now();
    let delta = now - dropStart;
    if (delta > 550) {
        p.moveDown();
        dropStart = Date.now();
    }
    if (!gameOver) {
        requestAnimationFrame(drop);
    }
}
drop();



// Quit game and start a new one
function restart() {
    window.location.reload()
}