import { Keys } from "../keys";
import { Level } from "./level";
import { SubGame } from "./subgame";

export class Game {

    allSubGames: SubGame[] = [];

    subGames: SubGame[] = [];
    activeSubGameIndex = 0;

    constructor() {
        const container = document.querySelector('.content')!;

        for (let i = 0; i < 5; i++) {
            const subGame = new SubGame(this);
            subGame.level = new Level(subGame);
            this.subGames.push(subGame);

            container.append(subGame.canvas);
        }
    }

    get activeSubGame() {
        return this.subGames[this.activeSubGameIndex];
    }

    update(dt: number) {
        this.activeSubGame.update(dt);

        // Go up a game
        if (Keys.wasPressedThisFrame('KeyS')) {
            this.goUpAGame();
        }
        if (Keys.wasPressedThisFrame('KeyD')) {
            this.goDownAGame();
        }
    }

    goUpAGame() {
        if (this.activeSubGameIndex <= 0) {
            return;
        }
        this.activeSubGameIndex--;
        this.activeSubGame.canvas.scrollIntoView({behavior: 'smooth'});
    }

    goDownAGame() {
        if (this.activeSubGameIndex >= this.subGames.length - 1) {
            return;
        }

        this.activeSubGameIndex++;
        this.activeSubGame.canvas.scrollIntoView({behavior: 'smooth'});
    }

    render() {
        for (const subGame of this.subGames) {
            subGame.render();
        }
    }
}