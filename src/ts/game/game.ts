import * as Images from "../images";
import { Keys } from "../keys";
import { Sounds } from "../sounds";
import { Power } from "./constants";
import { Level } from "./level";
import { SubGame } from "./subgame";

export const subGameScale = 0.1;

const startSubGame = 0;

Sounds.loadSound({name: 'main1', path: 'music/'});
Sounds.loadSound({name: 'main2', path: 'music/'});
Sounds.loadSound({name: 'main3', path: 'music/'});
Sounds.loadSound({name: 'main4', path: 'music/'});
Sounds.loadSound({name: 'main5', path: 'music/'});
Sounds.loadSound({name: 'cute1', path: 'music/'});
Sounds.loadSound({name: 'cute2', path: 'music/'});
Sounds.loadSound({name: 'cute3', path: 'music/'});

export class Game {

    allSubGames: SubGame[] = [];

    activeSubGameIndex = 0;

    constructor() {
        for (let i = 0; Images.images[`level${i}`] != undefined; i++) {
            const subGame = new SubGame(this, i);
            subGame.level = new Level(subGame, Images.images[`level${i}`].image!);
            this.allSubGames.push(subGame);
        }

        this.subGames.push(this.allSubGames[startSubGame]);

        const container = document.querySelector('.content');
        if (container == null) {
            throw new Error('No content??')
        }

        this.updateCanvases();

        this.updateSong();
    }

    get subGameIndexes(): number[] {
        const ret: number[] = [];

        let curIndex: number | undefined = startSubGame;
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
        const subGames = this.subGames;

        const container = document.querySelector('.content')!;

        while (container.firstChild) {
            container.removeChild(container.lastChild!);
        }

        for (let i = 0; i < subGames.length; i++) {
            container.append(subGames[i].canvas);
        }
        for (let i = subGames.length - 1; i >= 0; i--) {
            container.append(subGames[i].frameElem);
        }

        // Also render each thingo
        for (const subGame of this.subGames) {
            subGame.frameElem.style.filter = subGame.hueRotateFilter;

            subGame.render();
        }

        this.updateZoom();
        this.updateFades();
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
        this.updateZoom();
        this.updateFades();

        this.updateSong();
    }

    goDownAGame() {
        if (this.activeSubGameIndex >= this.subGames.length - 1) {
            return;
        }

        this.activeSubGameIndex++;
        this.updateZoom();
        this.updateFades();

        this.updateSong();
    }

    updateSong() {
        let songIndex = this.activeSubGameIndex + 1;
        if (songIndex > 5) {
            songIndex = 5;
        }
        let songName = `main${songIndex}`;
        // Some levels get special treatment
        switch (this.activeSubGame.index) {
            case 9:
                songName = 'main5';
                break;
            case 3:
                songName = 'cute2';
            case 6:
                songName = 'cute3';
            case 8:
                songName = 'cute3';
                break;
        }
        Sounds.setSong(songName);
    }

    updateZoom() {
        const zoomPerLevel = 1 / subGameScale;

        const subGames = this.subGames;
        for (let i = 0; i < subGames.length; i++) {
            let zoomIndex = this.activeSubGameIndex - i;

            const shown = zoomIndex >= -2 && zoomIndex <= 2;
            subGames[i].frameElem.classList.toggle('hidden', !shown);
            subGames[i].canvas.classList.toggle('hidden', !shown);

            const zoom = Math.pow(zoomPerLevel, this.activeSubGameIndex - i);

            subGames[i].frameElem.style.transform = `scale(${zoom})`;
            subGames[i].canvas.style.transform = `scale(${zoom})`;
        }
    }

    updateFades() {
        const subGames = this.subGames;

        for (let i = 0; i < subGames.length; i++) {
            if (i > this.activeSubGameIndex + 1) {
                subGames[i].canvas.classList.add('extra-faded');
                subGames[i].frameElem.classList.add('extra-faded');
            }
            else {
                subGames[i].canvas.classList.remove('extra-faded');
                subGames[i].frameElem.classList.remove('extra-faded');
            }

            if (i == this.activeSubGameIndex + 1) {
                subGames[i].canvas.classList.add('faded');
                subGames[i].frameElem.classList.add('faded');
            }
            else {
                subGames[i].canvas.classList.remove('faded');
                subGames[i].frameElem.classList.remove('faded');
            }
        }
    }

    render() {
        this.activeSubGame.render();
    }

    static loadAllImages(): Promise<void[]> {
        const promises: Promise<void>[] = [];
        for (let i = 0; i <= 11; i++) {
            promises.push(Images.loadImage({name: `level${i}`, extension: 'gif', path: 'levels/'}));
        }
        promises.push(Images.loadImage({name: 'frame', path: 'sprites/'}));
        return Promise.all(promises);
    }
}