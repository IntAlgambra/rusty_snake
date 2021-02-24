import {Game} from "wasm";
import {memory} from "wasm/snakewasm_bg";

//colors and stuff
const FIELD_COLOR = "#212529";
const SNAKE_COLOR = "#ff7777";
const APPLE_COLOR = "#ff7777";
// game field dimensions (in cells)
const GAME_FIELD_WIDTH = 24;
const GAME_FIELD_HEIGHT = 16;

// cell size in pixels
const CELL_SIZE = 20;

// snake speed in cells/sec
const SNAKE_SPEED = 5;
// time to render moving to one cell
const TIME_TO_RENDER = 1000/SNAKE_SPEED;

// some globals (it's bad practise, though)
const canvas = document.querySelector("#game");
canvas.width = GAME_FIELD_WIDTH * CELL_SIZE;
canvas.height = GAME_FIELD_HEIGHT * CELL_SIZE;
const ctx = canvas.getContext("2d");
ctx.fillStyle = FIELD_COLOR;
ctx.fillRect(0, 0, GAME_FIELD_WIDTH*CELL_SIZE, GAME_FIELD_HEIGHT*CELL_SIZE);
const score = document.querySelector("#score");
const playBtn = document.querySelector("#playBtn")



// Let's add some event listeners to control snake via arrow keys
document.addEventListener("keydown", (event) => {
    if (event.key == "ArrowDown") {
        game.turn_snake_up();
    } else if (event.key == "ArrowUp") {
        game.turn_snake_down();
    } else if (event.key == "ArrowRight") {
        game.turn_snake_right();
    } else if (event.key == "ArrowLeft") {
        game.turn_snake_left();
    }
})


// Function render apple on canvas
const renderApple = (ctx) => {
    const apple_x = game.apple_x()*CELL_SIZE;
    const apple_y = game.apple_y()*CELL_SIZE;
    ctx.fillStyle = APPLE_COLOR;
    ctx.fillRect(apple_x, apple_y, CELL_SIZE, CELL_SIZE);
}

// Function renders snake at the end of every animation
// Without animation we need only fire this functhion
// every game cycle
const renderGameCycle = (ctx) => {
    ctx.fillStyle = FIELD_COLOR;
    ctx.fillRect(0, 0, GAME_FIELD_WIDTH*CELL_SIZE, GAME_FIELD_HEIGHT*CELL_SIZE);
    ctx.fillStyle = SNAKE_COLOR;
    const pointer = game.pointer_to_snake();
    const dataLen = game.snake_data_len();
    const snakeBuf = new Uint32Array(memory.buffer, pointer, dataLen);
    const snake = snakeBuf.reduce((acc, item, index) => {
        if (index % 2 === 0) {
            acc.push([item, snakeBuf[index+1]])
        }
        return acc;
    }, [])
    snake.forEach((cell) => {
        ctx.fillRect(cell[0]*CELL_SIZE, cell[1]*CELL_SIZE, CELL_SIZE, CELL_SIZE);
    } )
}


// Function rendering shake head smooth animathion from one
// game state to another 
const renderHeadAnimation = (
    ctx,
    headX,
    headY,
    direction,
    progress
) => {
    const x = headX * CELL_SIZE;
    const y = headY * CELL_SIZE;
    const step = Math.floor(progress * CELL_SIZE);
    ctx.fillStyle = SNAKE_COLOR;
    if (direction === 2) {
        ctx.fillRect(x, y-step, CELL_SIZE, step);
    } else if (direction === 1) {
        ctx.fillRect(x+CELL_SIZE, y, step, CELL_SIZE);
    } else if (direction === 0) {
        ctx.fillRect(x, y+CELL_SIZE, CELL_SIZE, step);
    } else if (direction === 3) {
        ctx.fillRect(x-step, y, step, CELL_SIZE);
    }
}

// Function renders snake tail animathion from one game state to another
const renderTailAnimation = (
    ctx,
    tailX,
    tailY,
    direction,
    progress
) => {
    const x = tailX * CELL_SIZE;
    const y = tailY * CELL_SIZE;
    const step = Math.floor(progress * CELL_SIZE);
    ctx.fillStyle = FIELD_COLOR;
    if (direction === 2) {
        ctx.fillRect(x, y+CELL_SIZE-step, CELL_SIZE, step);
    } else if (direction === 1) {
        ctx.fillRect(x, y, step, CELL_SIZE);
    } else if (direction === 0) {
        ctx.fillRect(x, y, CELL_SIZE, step);
    } else if (direction === 3) {
        ctx.fillRect(x+CELL_SIZE-step, y, step, CELL_SIZE);
    }

}

// main function, launching game cycle
const run = (ctx) => {
    game = Game.new(GAME_FIELD_WIDTH, GAME_FIELD_HEIGHT)
    renderGameCycle(ctx);
    let tailX = game.tail_x();
    let tailY = game.tail_y();
    let headX = game.head_x();
    let headY = game.head_y();
    game.tick();
    let headDirection = game.head_direction();
    let tailDicrection = game.tail_direction();
    let time = performance.now();
    requestAnimationFrame(function drawFrame(current) {
        const frameProgress = (current - time) / TIME_TO_RENDER;
        if (frameProgress > 1) {
            score.textContent = `score: ${game.score()}`
            renderGameCycle(ctx);
            tailX = game.tail_x();
            tailY = game.tail_y();
            headX = game.head_x();
            headY = game.head_y();
            headDirection = game.head_direction();
            tailDicrection = game.tail_direction();
            game.tick();
            renderApple(ctx);
            if (game.is_stopped()) {
                playBtn.classList.toggle("inactiveBtn")
                return;
            }
            time = current;
            requestAnimationFrame(drawFrame)
        } else {
            renderHeadAnimation(
                ctx,
                headX,
                headY,
                headDirection,
                frameProgress
            )
            renderTailAnimation(
                ctx,
                tailX,
                tailY,
                tailDicrection,
                frameProgress
            )
            requestAnimationFrame(drawFrame)
        }
    })
}

playBtn.addEventListener("click", () => {
    run(ctx)
    playBtn.classList.toggle("inactiveBtn")
})



