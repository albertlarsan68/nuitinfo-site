
const SHAPES = [
    [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0]
    ],
    [
        [0, 1, 0],  
        [0, 1, 0],  
        [1, 1, 0]   
    ],
    [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1]
    ],
    [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],
    [
        [1, 1, 1],
        [0, 1, 0],
        [0, 0, 0]
    ],
    [
        [1, 1],
        [1, 1]
    ]
]

const COLORS = [
    "#9b5fe0",
    "#16a4d8",
    "#60dbe8",
    "#8bd346",
    "#efdf48",
    "#f9a52c",
    "#d64e12",
    "#fff"
]

const ROWS = 20;
const COLS = 10;

let canvas = document.querySelector("#tetris");
let scoreboard = document.querySelector("h3");
let ctx = canvas.getContext("2d");
ctx.scale(30,30);

let grid = generate_grid();
let falling_piece_obj = null;
let score = 0;

setInterval(new_game_state,500);
function new_game_state(){
    check_grid();
    if (!falling_piece_obj) {
        falling_piece_obj = random_piece_object();
        render_piece();
    }
    move_down();
}

function check_grid(){
    let count = 0;

    for (let y = 0; y < grid.length; y++) {
        let all_filled = true;
        for (let x = 0; x < grid[0].length; x++) {
            if (grid[y][x] == 0) {
                all_filled = false
            }
        }
        if (all_filled) {
            count++;
            grid.splice(y, 1);
            grid.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        }
    }
    if (count == 1) {
        score += 10;
    } else if (count == 2) {
        score += 30;
    } else if (count == 3) {
        score += 50;
    } else if (count > 3) {
        score += 100;
    }
    scoreboard.innerHTML = ("Score: " + score);
}

function generate_grid(){
    let grid = [];

    for (let y = 0; y < ROWS; y++) {
        grid.push([]);
        for (let x = 0; x < COLS; x++) {
            grid[y].push(0)
        }
    }
    return grid;
}

function random_piece_object(){
    let random = Math.floor(Math.random() * 7);
    let piece = SHAPES[random];
    let color = random + 1;
    let x = 4;
    let y = 0;

    return {piece, color, x, y}
}

function render_piece(){
    let piece = falling_piece_obj.piece;

    for (let y = 0; y < piece.length; y++) {
        for (let x = 0; x < piece[y].length; x++) {
            if (piece[y][x] == 1) {
                ctx.fillStyle = COLORS[falling_piece_obj.color];
                ctx.fillRect(falling_piece_obj.x + x,falling_piece_obj.y + y, 1, 1);
            }
        }
    }
}

function move_down(){
    if (!collision(falling_piece_obj.x, falling_piece_obj.y + 1)) {
        falling_piece_obj.y += 1;
    } else {
        let piece = falling_piece_obj.piece

        for(let y = 0; y < piece.length; y++){
            for(let x = 0; x < piece[y].length; x++){
                if (piece[y][x] == 1) {
                    let p = falling_piece_obj.x + x;
                    let q = falling_piece_obj.y + y;

                    grid[q][p] = falling_piece_obj.color;
                }
            }
        }
        if (falling_piece_obj.y == 0) {
            alert("You haven't reach 404 score");
            grid = generate_grid();
            score = 0;
        }
        if (score >= 404) {
            alert("Congratulation you have lost your time :)");
            grid = generate_grid();
            score = 0;
        }
        falling_piece_obj = null;
    }
    render_game();
}

function move_left(){
    if (!collision(falling_piece_obj.x - 1, falling_piece_obj.y)) {
        falling_piece_obj.x -= 1;
    }
    render_game();
}

function move_right(){
    if (!collision(falling_piece_obj.x + 1, falling_piece_obj.y)) {
        falling_piece_obj.x += 1;
    }
    render_game();
}

function rotate(){
    let rotated_piece = [];
    let piece = falling_piece_obj.piece;

    for(let y = 0; y < piece.length; y++) {
        rotated_piece.push([]);
        for(let x = 0; x < piece[y].length; x++) {
            rotated_piece[y].push(0);
        }
    }
    for(let y = 0; y < piece.length; y++){
        for(let x = 0; x < piece[y].length; x++){
            rotated_piece[y][x] = piece[x][y]
        }
    }
    for(let index = 0; index < rotated_piece.length; index++){
        rotated_piece[index] = rotated_piece[index].reverse();
    }
    if (!collision(falling_piece_obj.x, falling_piece_obj.y, rotated_piece)) {
        falling_piece_obj.piece = rotated_piece
    }
    render_game()
}

function collision(x, y, rotated_piece){
    let piece = rotated_piece || falling_piece_obj.piece

    for (let i = 0; i < piece.length; i++) {
        for (let j = 0; j < piece[i].length; j++) {
            if (piece[i][j] == 1) {
                let p = x + j;
                let q = y + i;
                if (p >= 0 && p < COLS && q >= 0 && q < ROWS) {
                    if (grid[q][p] > 0) {
                        return true;
                    }
                } else {
                    return true;
                }
            }
        }
    }
    return false;
}

function render_game(){
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            ctx.fillStyle = COLORS[grid[y][x]];
            ctx.fillRect(x, y, 1, 1)
        }
    }
    render_piece();
}

document.addEventListener("keydown",function(e){
    let key = e.key;

    if (key == "ArrowDown") {
        move_down();
    } else if (key == "ArrowLeft") {
        move_left();
    } else if (key == "ArrowRight") {
        move_right();
    } else if (key == "ArrowUp") {
        rotate();
    }
})