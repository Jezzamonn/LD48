import { PX_SCREEN_HEIGHT, PX_SCREEN_WIDTH } from "./game/constants";
import { Game } from "./game/game";
import { Level } from "./game/level";
import { SubGame } from "./game/subgame";
import { Keys } from "./keys";

let simulatedTimeMs: number;
let timeStep = 1 / 60;

let game: Game;

function init() {
    Keys.setUp();

    game = new Game();

    requestAnimationFrame(doAnimationFrame);
}

function doAnimationFrame() {
    if (simulatedTimeMs == null) {
        simulatedTimeMs = Date.now();
    }

    let curTimeMs = Date.now();
    let updateCount = 0;
    while (simulatedTimeMs < curTimeMs) {
        update();

        simulatedTimeMs += timeStep * 1000;

        updateCount++;
        if (updateCount > 10) {
            simulatedTimeMs = curTimeMs;
            break;
        }
    }

    render();

    requestAnimationFrame(doAnimationFrame);
}

function update() {
    game.update(timeStep);
    Keys.resetFrame();
}

function render() {
    game.render();
}


window.onload = init;