const actionAudio = document.querySelector("#actionSound");

export function log_stuff(stuff) {
    actionAudio.play()
    console.log(actionAudio.readyState);
    // if (actionAudio.readyState === 4) {
    //     actionAudio.play()
    // }
    console.log(stuff);
}