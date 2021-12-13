const canvas = document.getElementById("canva")
const ctx = canvas.getContext("2d")
const scoreElement = document.getElementById("score")

//Number of columns and rows the board will have 
const COLS = 10;
const ROWS = 20;

// Block size: it is a square, width and height are going to be the same 
const BLOCK_SIZE = 20;

//Color of squares that are not taken by any figure
const EMPTY = "#EFEFEF";


//Draw the squares of the board
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

//Array with previous pieces and their colors
const PIECES = [
    [Z, "red"],
    [S, "green"],
    [T, "yellow"],
    [O, "blue"],
    [L, "purple"],
    [I, "cyan"],
    [J, "orange"]
];

//Generate random pieces.   Choose a random number that will be the index to select the piece from the array 
function randomPiece() {
    let ranPiece = Math.floor(Math.random() * PIECES.length) //Index position to select figure from array of pieces
    return new Piece(PIECES[ranPiece][0], PIECES[ranPiece][1]) // selected figure and its color as parameters of the object: Piece 
}

let p = randomPiece();
//Object piece 

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

/* In order to move the figure, left, right, down, we need to:
 - Evaluate future position of the figure to know if threre are any collisions
 - Undraw the current figure
 - Translate the figure's coordinates to the desire place
 - Draw the figure
 */



// Draw the figure
Piece.prototype.fill = function(color) {
    for (r = 0; r < this.actFigure.length; r++) { // Array's rows  of the figure's specific position 
        for (c = 0; c < this.actFigure.length; c++) { // Array's columns  of the figure's specific position 
            if (this.actFigure[r][c]) { // each square in the array of the specific position of the figure 
                drawSq(this.x + c, this.y + r, color);
            }
        }
    }
}

//Draw the figure
Piece.prototype.draw = function() {
    this.fill(this.color);
}

//Undraw the figure
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
    let nextPat = this.figure[(this.figureN + 1) % this.figure.length];
    let kick = 0;

    if (this.collision(0, 0, nextPat)) {
        if (this.x > COLS / 2) {
            // it's the right wall
            kick = -1; // we need to move the piece to the left
        } else {
            // it's the left wall
            kick = 1; // we need to move the piece to the right
        }
    }
    if (!this.collision(kick, 0, nextPat)) {
        this.unDraw();
        this.x += kick;
        this.figureN = (this.figureN + 1) % this.figure.length;
        this.actFigure = this.figure[this.figureN];
        this.draw();
    }
}


let score = 0;

Piece.prototype.lock = function() {
    for (r = 0; r < this.actFigure.length; r++) {
        for (c = 0; c < this.actFigure.length; c++) {
            // we skip the vacant squares
            if (!this.actFigure[r][c]) {
                continue;
            }
            // pieces to lock on top = game over
            if (this.y + r < 0) {
                alert("Game Over");
                // stop request animation frame
                gameOver = true;
                break;
            }
            // we lock the piece
            board[this.y + r][this.x + c] = this.color;
        }
    }
    // remove full rows
    for (r = 0; r < ROWS; r++) {
        let isRowFull = true;
        for (c = 0; c < COLS; c++) {
            isRowFull = isRowFull && (board[r][c] != EMPTY);
        }
        if (isRowFull) {
            // if the row is full
            // we move down all the rows above it
            for (y = r; y > 1; y--) {
                for (c = 0; c < COLS; c++) {
                    board[y][c] = board[y - 1][c];
                }
            }
            // the top row board has no row above it
            for (c = 0; c < COLS; c++) {
                board[0][c] = EMPTY;
            }
            // increment the score
            score += 10;
        }
    }
    // update the board
    drawBoard();


    // update the score
    scoreElement.innerHTML = score;
}

// collision fucntion

Piece.prototype.collision = function(x, y, piece) {
    for (r = 0; r < piece.length; r++) {
        for (c = 0; c < piece.length; c++) {
            // if the square is empty, we skip it
            if (!piece[r][c]) {
                continue;
            }
            // coordinates of the piece after movement
            let newX = this.x + c + x;
            let newY = this.y + r + y;

            // conditions
            if (newX < 0 || newX >= COLS || newY >= ROWS) {
                return true;
            }
            // skip newY < 0; board -1 will crush our game
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

// CONTROL the piece

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

// drop the piece every 1sec

let dropStart = Date.now();
let gameOver = false;

function drop() {
    let now = Date.now();
    let delta = now - dropStart;
    if (delta > 500) {
        p.moveDown();
        dropStart = Date.now();
    }
    if (!gameOver) {
        requestAnimationFrame(drop);
    }
}

drop();


function drawNext() {
    let canvas2 = document.getElementById("canva-piece");
    let ctx2 = canvas2.getContext("2d")
}
drawNext()