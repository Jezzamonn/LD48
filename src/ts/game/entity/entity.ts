import { number } from "yargs";
import { toPx } from "../constants";
import { Level, TILE_GROUND } from "../level";

export class Entity {

    // Up ref to the level
    level: Level;

    x: number = 0;
    y: number = 0;
    w: number = 0;
    h: number = 0;
    dx: number = 0;
    dy: number = 0;
    gravity: number = 5000;
    canColide: boolean = true;

    constructor() {
    }

    update(dt: number) {
        this.dy += this.gravity * dt;

        this.moveX(dt);
        this.moveY(dt);
    }

    moveX(dt: number) {
        this.x += this.dx * dt;
        this.x = Math.round(this.x);

        // TODO: Horizontal collision
        if (this.canColide) {
        }
    }

    moveY(dt: number) {
        this.y += this.dy * dt;
        this.y = Math.round(this.y);

        // TODO: Upward collision
        if (this.canColide) {
            if (this.level.coordIsTouching({x: this.minX, y: this.maxY}, TILE_GROUND) ||
                this.level.coordIsTouching({x: this.maxX, y: this.maxY}, TILE_GROUND)) {

                const resetPos = this.level.getTilePosFromCoord({x: this.midX, y: this.maxY}, {x: 0, y: 0});
                this.maxY = resetPos.y;
            }
        }
    }

    render(context: CanvasRenderingContext2D) {
        // Debug rendering
        context.fillStyle = '#f0f';
        context.fillRect(toPx(this.minX), toPx(this.minY), toPx(this.w), toPx(this.h));
    }

    // Getters and setter and junk.
    get minX() {
        return this.x;
    }

    set minX(val: number) {
        this.x = val;
    }

    get midX() {
        return this.x + this.w / 2;
    }

    set midX(val: number) {
        this.x = val - this.w / 2;
    }

    get maxX() {
        return this.x + this.w;
    }

    set maxX(val: number) {
        this.x = val - this.w;
    }

    get minY() {
        return this.y;
    }

    set minY(val: number) {
        this.y = val;
    }

    get midY() {
        return this.y + this.w / 2;
    }

    set midY(val: number) {
        this.y = val - this.w / 2;
    }

    get maxY() {
        return this.y + this.w;
    }

    set maxY(val: number) {
        this.y = val - this.w;
    }
}