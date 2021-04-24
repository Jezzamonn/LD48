import { Keys } from "../keys";
import { Level } from "./level";
import { SubGame } from "./subgame";

export class Game {

    allSubGames: SubGame[] = [];

    activeSubGameIndex = 0;

    constructor() {
        for (let i = 0; i < 5; i++) {
            const subGame = new SubGame(this, i);
            subGame.level = new Level(subGame);
            this.allSubGames.push(subGame);
        }

        this.subGames.push(this.allSubGames[0]);

        this.updateCanvases();
    }

    get subGameIndexes(): number[] {
        const ret: number[] = [];

        let curIndex: number | undefined = 0;
        while (curIndex != null) {
            ret.push(curIndex);

            const subGame: SubGame = this.allSubGames[curIndex];
            curIndex = subGame.level.player.pickup?.subGameIndex;
        }
        return ret;
    }

    get subGames() {
        return this.subGameIndexes.map(ix => this.allSubGames[ix]);
    }

    updateCanvases() {
        const container = document.querySelector('.content')!;
        while (container.firstChild) {
            container.removeChild(container.lastChild!);
        }
        for (const subGame of this.subGames) {
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