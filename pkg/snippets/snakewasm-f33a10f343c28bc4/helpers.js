const actionAudio = document.querySelector("#actionSound");
const gameOverAudio = document.querySelector("#gameoverSound");

export function play_eating_sound(stuff) {
    actionAudio.play()
}

export function play_gameover_sound() {
    gameOverAudio.play();
}