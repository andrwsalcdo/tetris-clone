const canvas = document.getElementById('tetris'); 
const context = canvas.getContext('2d'); 

context.scale(20,20); //scale items 20x. 

const matrix = [
    [0,0,0], 
    [1,1,1], 
    [0,1,0],
]; 

function collide(arena, player) {
    const [m, o] = [player.matrix, player.pos]; 
    
    for (let y =0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 &&
               (arena[y + o.y] &&
               arena[y + o.y][x + o.x]) !== 0) {
                    return true; 
               }
        }
    }
    return false; 
}

function createMatrix(w, h) {
    const matrix = []; 
    while(h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix; 
}

function draw() {
    context.fillStyle = '#000'; 
    context.fillRect(0, 0, canvas.width, canvas.height); 
    
    // after collision, keeps pieces in same pos. 
    drawMatrix(arena, {x: 0, y: 0}); 
    drawMatrix(player.matrix, player.pos); 
}

function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
            context.fillStyle = 'red'; 
            context.fillRect(x + offset.x, 
                             y + offset.y, 
                             1, 1); 
            }
        });
    }); 
}

function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + player.pos.y][x + player.pos.x] = value; 
            }
        });
    });
}

function playerDrop() {
    player.pos.y++;
    if (collide(arena, player)) {
        player.pos.y--; 
        merge(arena, player); 
        player.pos.y = 0; // back to the top. 
    }
    dropCounter = 0; // u want a drop delay after press down. 
}

function playerMove(direction) {
    player.pos.x += direction; 
    if(collide(arena, player)) { player.pos.x -= direction; }
}


function rotate(matrix, direction) {
    for (let y=0; y < matrix.length; ++y) {
        for (let x=0; x < y; ++x) {
            // deconstructing to switch matrix values and rotate
            [ 
                matrix[x][y],
                matrix[y][x]
            ] = [
                matrix[y][x], 
                matrix[x][y]
            ]; 
        }
    }
    if (direction > 0) { 
        matrix.forEach(row => row.reverse());
    } else { 
        matrix.reverse();  
    }
}

function playerRotate(direction) {
    rotate(player.matrix, direction); 
}

let dropCounter = 0; 
let dropInterval = 1000; // drop pieces every 1 sec 

let lastTime = 0; 
function update(time = 0) {
    const deltaTime = time - lastTime; 
    lastTime = time; 

    dropCounter += deltaTime; 
    if (dropCounter > dropInterval) {
        playerDrop(); 
    } // this is the drop piece movment 

    draw(); //moves the pieces 
    requestAnimationFrame(update); 
}

const arena = createMatrix(12, 20); 


const player = {
    pos: {x: 5, y: 5}, 
    matrix
}

document.addEventListener('keydown', event => {
    if ( event.keyCode === 37) {
        playerMove(-1); // left arrow
    } else if (event.keyCode === 39) {
        playerMove(+1); // right arrow
    } else if (event.keyCode === 40) {
        playerDrop(); // down arrow
    } else if (event.keyCode === 81) {
        playerRotate(-1); // Q
    } else if (event.keyCode === 87) {
        playerRotate(1); // W
    }
    
}); 

update(); //iniatializes the game. 