import { Point, SCREEN_HEIGHT } from "./constants";

export const TILE_AIR = 0;
export const TILE_GROUND = 1;

export class Level {
    constructor() {
    }

    update() {
    }

    render(context: CanvasRenderingContext2D) {
        // Just fill the canvas for the mo.
        context.save();
        context.resetTransform();
        context.fillStyle = 'white';
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        context.restore();
    }

    coordIsTouching(pos: Point, type: number): boolean {
        const pretendType = pos.y > SCREEN_HEIGHT ? TILE_AIR : TILE_GROUND;
        return pretendType == type;
    }
}