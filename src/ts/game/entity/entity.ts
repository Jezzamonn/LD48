import { Dir, Point, toPx, toRoundedPx } from "../constants";
import { Level, Tile } from "../level";

export class Entity {

    // Up ref to the level
    level!: Level;

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
            if (this.dx < 0) {
                if (this.isTouching(Tile.GROUND, {dir: Dir.LEFT})) {
                    this.onLeftCollision();
                }
            }
            if (this.dx > 0) {
                if (this.isTouching(Tile.GROUND, {dir: Dir.RIGHT})) {
                    this.onRightCollision();
                }
            }
        }
    }

    moveY(dt: number) {
        this.y += this.dy * dt;
        this.y = Math.round(this.y);

        if (this.canColide) {
            if (this.dy < 0) {
                if (this.isTouching(Tile.GROUND, {dir: Dir.UP})) {
                    this.onUpCollision();
                }
            }
            if (this.dy > 0) {
                if (this.isTouching(Tile.GROUND, {dir: Dir.DOWN})) {
                    this.onDownCollision();
                }
            }
        }
    }

    // Functions that can also be edited by subclasses
    onUpCollision() {
        const resetPos = this.level.getTilePosFromCoord({y: this.minY}, {y: 1});
        this.minY = resetPos + 1;

        this.dy = 0;
    }
    onDownCollision() {
        const resetPos = this.level.getTilePosFromCoord({y: this.maxY}, {y: 0});
        this.maxY = resetPos - 1;

        this.dy = 0;
    }
    onLeftCollision() {
        const resetPos = this.level.getTilePosFromCoord({x: this.minX}, {x: 1});
        this.minX = resetPos + 1;

        this.dx = 0;
    }
    onRightCollision() {
        const resetPos = this.level.getTilePosFromCoord({x: this.maxX}, {x: 0});
        this.maxX = resetPos - 1;

        this.dx = 0;
    }

    render(context: CanvasRenderingContext2D) {
        // Debug rendering
        context.fillStyle = '#f0f';
        context.fillRect(toRoundedPx(this.minX), toRoundedPx(this.minY), toRoundedPx(this.w), toRoundedPx(this.h));
    }

    isStandingOnGround() {
        return this.isTouching(Tile.GROUND, {dir: Dir.DOWN, offset: {x: 0, y: 1}});
    }

    isTouching(tile: Tile, {dir, offset = {x: 0, y: 0}}: {dir?: Dir, offset?: Point}={}) {
        let coords: Point[];
        switch (dir) {
            case Dir.LEFT:
                coords = [
                    {x: this.minX, y: this.minY},
                    {x: this.minX, y: this.maxY},
                ];
                break;
            case Dir.RIGHT:
                coords = [
                    {x: this.maxX, y: this.minY},
                    {x: this.maxX, y: this.maxY},
                ];
                break;
            case Dir.UP:
                coords = [
                    {x: this.minX, y: this.minY},
                    {x: this.maxX, y: this.minY},
                ];
                break;
            case Dir.DOWN:
                coords = [
                    {x: this.minX, y: this.maxY},
                    {x: this.maxX, y: this.maxY},
                ];
                break;
            default:
                coords = [
                    {x: this.minX, y: this.minY},
                    {x: this.maxX, y: this.minY},
                    {x: this.minX, y: this.maxY},
                    {x: this.maxX, y: this.maxY},
                ];
        }
        return coords
            // Add the offset
            .map(coord => {
                coord.x += offset.x;
                coord.y += offset.y;
                return coord;
            })
            // check if any position is touching
            .some(coord => this.level.coordIsTouching(coord, tile));
    }

    isOn(tile: Tile) {
        const coords = [
            {x: this.minX, y: this.minY},
            {x: this.maxX, y: this.minY},
            {x: this.minX, y: this.maxY},
            {x: this.maxX, y: this.maxY},
        ];
        return coords.every(coord => this.level.coordIsTouching(coord, tile));
    }

    //#region Getters and setter and junk.
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

    //#endregion
}