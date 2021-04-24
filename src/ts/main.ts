import { PX_SCREEN_HEIGHT, PX_SCREEN_WIDTH } from "./game/constants";
import { Game } from "./game/game";
import { Level } from "./game/level";
import { SubGame } from "./game/subgame";
import { Keys } from "./keys";

const PIXEL_SCALE = 2;

let canvas: HTMLCanvasElement;
let context: CanvasRenderingContext2D;

let simulatedTimeMs: number;
let timeStep = 1 / 60;

let game: Game;

function init() {
    canvas = document.querySelector('.canvas')!;
    canvas.width = PX_SCREEN_WIDTH;
    canvas.height = PX_SCREEN_HEIGHT;
    canvas.style.width = (PIXEL_SCALE * PX_SCREEN_WIDTH) + 'px';
    canvas.style.height = (PIXEL_SCALE * PX_SCREEN_HEIGHT) + 'px';

    context = canvas.getContext('2d')!;

    Keys.setUp();

    const subGame = new SubGame();
    subGame.level = new Level();

    game = new Game();
    game.subGames.push(subGame);

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
    game.render(context);
}


window.onload = init;