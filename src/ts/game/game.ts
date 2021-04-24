import { SubGame } from "./subgame";

export class Game {

    subGames: SubGame[] = [];
    activeSubGameIndex = 0;

    constructor() {
    }

    get activeSubGame() {
        return this.subGames[this.activeSubGameIndex];
    }

    update(dt: number) {
        this.activeSubGame.update(dt);
    }

    render(context: CanvasRenderingContext2D) {
        context.resetTransform();
        this.activeSubGame.render(context);
    }
}