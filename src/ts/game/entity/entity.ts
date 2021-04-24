import { toPx } from "../constants";

export class Entity {

    x: number;
    y: number;
    w: number;
    h: number;

    constructor() {
    }

    update() {
        // Nothing yet.
    }

    render(context: CanvasRenderingContext2D) {
        // Debug rendering
        context.fillStyle = '#f0f';
        context.fillRect(toPx(this.topX), toPx(this.topY), toPx(this.w), toPx(this.h));
    }

    // Getters and setter and junk.
    get topX() {
        return this.x;
    }

    set topX(val: number) {
        this.x = val;
    }

    get centerX() {
        return this.x + this.w / 2;
    }

    set centerX(val: number) {
        this.x = val - this.w / 2;
    }

    get bottomX() {
        return this.x + this.w;
    }

    set bottomX(val: number) {
        this.x = val - this.w;
    }

    get topY() {
        return this.y;
    }

    set topY(val: number) {
        this.y = val;
    }

    get centerY() {
        return this.y + this.w / 2;
    }

    set centerY(val: number) {
        this.y = val - this.w / 2;
    }

    get bottomY() {
        return this.y + this.w;
    }

    set bottomY(val: number) {
        this.y = val - this.w;
    }
}