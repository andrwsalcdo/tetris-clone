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

function createPiece(type) {
    if (type === 'T') {
        return [
            [0,0,0], 
            [1,1,1], 
            [0,1,0],
        ]; 
    } else if (type === 'O') {
        return [
            [2,2],
            [2,2],
        ];
    } else if (type == 'L') {
        return [
            [0,3,0],
            [0,3,0],
            [0,3,3],
        ];
    } else if (type == 'J') {
        return [
            [0,4,0],
            [0,4,0],
            [4,4,0],
        ];
    } else if (type == 'I') {
        return [
            [0,5,0,0],
            [0,5,0,0],
            [0,5,0,0],
            [0,5,0,0],            
        ];
    } else if (type == 'S') {
        return [
            [0,6,6],
            [6,6,0],
            [0,0,0],           
        ];
    } else if (type == 'Z') {
        return [
            [7,7,0],
            [0,7,7],
            [0,0,0],           
        ];
    }
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
            context.fillStyle = colors[value]; 
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
        playerReset(); // back to the top. 
    }
    dropCounter = 0; // u want a drop delay after press down. 
}

function playerMove(direction) {
    player.pos.x += direction; 
    if(collide(arena, player)) { player.pos.x -= direction; }
}

function playerReset() {
    const pieces = "ILJOTSZ"; 
    player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]); 
    player.pos.y = 0; 
    player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0); 
    
    //clear arena, or game over, on instant collison
    if(collide(arena, player)) {
        arena.forEach(row => row.fill(0)); 
    }
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
    const pos = player.pos.x; 
    let offset = 1; 
    rotate(player.matrix, direction); 
    while (collide(arena, player)) {
        player.pos.x += offset; 
        offset = -(offset + (offset > 0 ? 1 : -1)); 
        if (offset > player.matrix[0].length) {
            rotate(player.matrix, -direction); 
            player.pos.x = pos; 
            return; 
        }
    }
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

const colors = [
    null, 
      '#FF0D72',
     '#0DC2FF',
     '#0DFF72',
     '#F538FF',
     '#FF8E0D',
     '#FFE138',
     '#3877FF',
]
const arena = createMatrix(12, 20); 

const player = {
    pos: {x: 5, y: 5}, 
    matrix: createPiece('T')
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