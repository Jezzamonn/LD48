import { lerp } from "../../util";
import { fromPx, Point, PX_SCREEN_HEIGHT, PX_SCREEN_WIDTH, SCREEN_HEIGHT, SCREEN_WIDTH, toRoundedPx } from "../constants";

const updateSmoothness = 0.05;

export class Camera {

    getTargetPxPosition = () => ({x: 0, y: 0});

    curPxPos: Point = {x: 0, y: 0};

    constructor() {
    }

    update(dt: number) {
        const targetPxPos = this.getTargetPxPosition();
       this.curPxPos.x = lerp(this.curPxPos.x, targetPxPos.x, updateSmoothness);
       this.curPxPos.y = lerp(this.curPxPos.y, targetPxPos.y, updateSmoothness);
    }

    applyToContext(context: CanvasRenderingContext2D) {
        context.translate(PX_SCREEN_WIDTH / 2, PX_SCREEN_HEIGHT / 2);
        context.translate(Math.round(-this.curPxPos.x), Math.round(-this.curPxPos.y));
    }

    // In in-game dimensions
    get minVisibleX() {
        return fromPx(this.curPxPos.x - PX_SCREEN_WIDTH / 2);
    }

    get minVisibleY() {
        return fromPx(this.curPxPos.y - PX_SCREEN_HEIGHT / 2);
    }

    get maxVisibleX() {
        return fromPx(this.curPxPos.x + PX_SCREEN_WIDTH / 2);
    }

    get maxVisibleY() {
        return fromPx(this.curPxPos.y + PX_SCREEN_HEIGHT / 2);
    }
}