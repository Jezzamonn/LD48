import { lerp } from "../util";
import { Point, rng, SCREEN_HEIGHT, SCREEN_WIDTH, fromPx } from "./constants";
import { Entity } from "./entity/entity";
import { Player } from "./entity/player";

export const TILE_AIR = 0;
export const TILE_GROUND = 1;

export class Level {

    player: Player;
    entities: Entity[] = [];

    constructor() {
        for (let i = 0; i < 10; i++) {
            const ent = new Entity();
            ent.level = this;
            ent.midX = lerp(0, SCREEN_WIDTH, rng());
            ent.maxY = lerp(0, SCREEN_HEIGHT, rng());
            ent.w = fromPx(10);
            ent.h = fromPx(10);
            this.entities.push(ent);
        }

        this.player = new Player();
        this.player.level = this;
        this.player.midX = lerp(0, SCREEN_WIDTH, rng());
        this.player.maxY = lerp(0, SCREEN_HEIGHT, rng());
        this.player.w = fromPx(10);
        this.player.h = fromPx(10);
        this.entities.push(this.player);
    }

    update(dt: number) {
        for (const entity of this.entities) {
            entity.update(dt);
        }
    }

    render(context: CanvasRenderingContext2D) {
        // Just fill the canvas for the mo.
        context.save();
        context.resetTransform();
        context.fillStyle = 'white';
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        context.restore();

        for (const entity of this.entities) {
            entity.render(context);
        }
    }

    coordIsTouching(pos: Point, type: number): boolean {
        const pretendType = pos.y < SCREEN_HEIGHT ? TILE_AIR : TILE_GROUND;
        return pretendType == type;
    }

    getTilePosFromCoord(coord: Point, tilePos: Point): Point {
        // For the sec, just return the bottom?
        return {
            x: 0,
            y: SCREEN_HEIGHT,
        }
    }
}