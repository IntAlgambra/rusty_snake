import {Game} from "wasm";
import {memory} from "wasm/snakewasm_bg";
import { game_apple_y } from "wasm/snakewasm_bg.wasm";

// snake speed in cells/sec
const SNAKE_SPEED = 5;
const FIELD_COLOR = "#e6e6ff";
const SNAKE_COLOR = "#1e1e3c";
const APPLE_COLOR = "#a92c22"
// time to render moving to one cell
const TIME_TO_RENDER = 1000/SNAKE_SPEED;
let stuff = 0;


const game = Game.new(16, 16);
const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
const score = document.querySelector("#score")


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


const renderApple = (ctx) => {
    const apple_x = game.apple_x()*10;
    const apple_y = game.apple_y()*10;
    ctx.fillStyle = APPLE_COLOR;
    ctx.fillRect(apple_x, apple_y, 10, 10);
}

const renderGameCycle = (ctx) => {
    console.log(`render cycle ${stuff}`)
    stuff += 1;
    ctx.fillStyle = FIELD_COLOR;
    ctx.fillRect(0, 0, 320, 320);
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
        ctx.fillRect(cell[0]*10, cell[1]*10, 10, 10);
    } )
}

const renderHeadAnimation = (
    ctx,
    headX,
    headY,
    direction,
    progress
) => {
    const x = headX * 10;
    const y = headY * 10;
    const step = Math.floor(progress * 10);
    ctx.fillStyle = SNAKE_COLOR;
    if (direction === 2) {
        ctx.fillRect(x, y-step, 10, step);
    } else if (direction === 1) {
        ctx.fillRect(x+10, y, step, 10);
    } else if (direction === 0) {
        ctx.fillRect(x, y+10, 10, step);
    } else if (direction === 3) {
        ctx.fillRect(x-step, y, step, 10);
    }
}

const renderTailAnimation = (
    ctx,
    tailX,
    tailY,
    direction,
    progress
) => {
    const x = tailX * 10;
    const y = tailY * 10;
    const step = Math.floor(progress * 10);
    ctx.fillStyle = FIELD_COLOR;
    if (direction === 2) {
        ctx.fillRect(x, y+10-step, 10, step);
    } else if (direction === 1) {
        ctx.fillRect(x, y, step, 10);
    } else if (direction === 0) {
        ctx.fillRect(x, y, 10, step);
    } else if (direction === 3) {
        ctx.fillRect(x+10-step, y, step, 10);
    }

}

const run = (ctx) => {
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

run(ctx);

// function main() {
//     renderGameCycle(ctx);
// };

// main();



