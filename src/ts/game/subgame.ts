import { Level } from "./level";

export class SubGame {

    level: Level;

    constructor() {}

    update() {
        this.level.update();
    }

    render(context: CanvasRenderingContext2D) {
        this.level.render(context);
    }
}