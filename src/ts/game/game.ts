import { Level } from "./level";
import { SubGame } from "./subgame";

export class Game {

    allSubGames: SubGame[] = [];

    subGames: SubGame[] = [];
    // activeSubGameIndex = 0;

    get activeSubGameIndex() {
        for (let i = 0; i < this.subGames.length; i++) {
            const subGame = this.subGames[i];
            if (subGame.level.player.pickup == null) {
                return i;
            }
        }
        return this.subGames.length - 1;
    }

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
    }

    render() {
        for (const subGame of this.subGames) {
            subGame.render();
        }
    }
}