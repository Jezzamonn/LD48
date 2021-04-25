import * as Images from "../images";
import { Keys } from "../keys";
import { Power } from "./entity/pickup";
import { Level } from "./level";
import { SubGame } from "./subgame";

export class Game {

    allSubGames: SubGame[] = [];

    activeSubGameIndex = 0;

    constructor() {
        for (let i = 0; Images.images[`level${i}`] != undefined; i++) {
            const subGame = new SubGame(this, i);
            subGame.level = new Level(subGame, Images.images[`level${i}`].image!);
            this.allSubGames.push(subGame);
        }

        this.subGames.push(this.allSubGames[0]);

        this.updateCanvases();
    }

    get subGameIndexes(): number[] {
        const ret: number[] = [];

        let curIndex: number | undefined = 0;
        while (curIndex != null && curIndex < this.allSubGames.length) {
            ret.push(curIndex);

            const subGame: SubGame = this.allSubGames[curIndex];
            curIndex = subGame.level.player.pickup?.subGameIndex;
        }
        return ret;
    }

    get subGames() {
        return this.subGameIndexes
            .map(ix => this.allSubGames[ix]);
    }


    get currentPowers(): Set<Power> {
        const s = new Set<Power>();

        for (const subGame of this.subGames) {
            const power = subGame.level.player.pickup?.power;
            if (power == null) {
                continue;
            }
            s.add(power);
        };

        return s;
    }

    updateCanvases() {
        const container = document.querySelector('.content')!;
        while (container.firstChild) {
            container.removeChild(container.lastChild!);
        }
        for (const subGame of this.subGames) {
            container.append(subGame.canvas);
        }

        // Also render each thingo
        for (const subGame of this.subGames) {
            subGame.render();
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
        this.activeSubGame.render();
    }

    static loadAllImages(): Promise<void[]> {
        const promises: Promise<void>[] = [];
        for (let i = 0; i <= 2; i++) {
            promises.push(Images.loadImage({name: `level${i}`, path: 'levels/'}));
        }
        return Promise.all(promises);
    }
}