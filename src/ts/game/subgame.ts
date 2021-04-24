import { Level } from "./level";

export class SubGame {

    level!: Level;

    constructor() {}

    update(dt: number) {
        this.level.update(dt);
    }

    render(context: CanvasRenderingContext2D) {
        this.level.render(context);
    }
}