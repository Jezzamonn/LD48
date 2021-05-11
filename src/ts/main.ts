import { PX_FRAME_HEIGHT, PX_FRAME_WIDTH } from "./game/constants";
import { Game } from "./game/game";
import { Keys } from "./keys";

let simulatedTimeMs: number;
let timeStep = 1 / 60;

let game: Game;

async function init() {
    Keys.setUp();

    resize();
    window.addEventListener('resize', resize);

    await Game.loadAllImages();

    game = new Game();

    requestAnimationFrame(doAnimationFrame);
}

function resize() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const xScale = windowWidth / PX_FRAME_WIDTH;
    const yScale = windowHeight / PX_FRAME_HEIGHT;

    const scale = Math.max(Math.min(xScale, yScale), 1);

    const pixelRatio = window.devicePixelRatio || 1;

    const pxScale = Math.floor(scale * pixelRatio) / pixelRatio;
    document.body.style.setProperty('--px-scale', pxScale.toString());
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