import { lerp } from "../../util";
import { fromPx, Point, PX_SCREEN_HEIGHT, PX_SCREEN_WIDTH, SCREEN_HEIGHT, SCREEN_WIDTH, toRoundedPx } from "../constants";

const updateSmoothness = 0.05;

export class Camera {

    getTargetPosition = () => ({x: 0, y: 0});

    curPos: Point = {x: 0, y: 0};

    constructor() {
    }

    update(dt: number) {
        const targetPos = this.getTargetPosition();
        this.curPos.x = lerp(this.curPos.x, targetPos.x, updateSmoothness);
        this.curPos.y = lerp(this.curPos.y, targetPos.y, updateSmoothness);
    }

    applyToContext(context: CanvasRenderingContext2D) {
        context.translate(PX_SCREEN_WIDTH / 2, PX_SCREEN_HEIGHT / 2);
        context.translate(toRoundedPx(-this.curPos.x), toRoundedPx(-this.curPos.y));
    }

    // In in-game dimensions
    get minVisibleX() {
        return this.curPos.x - SCREEN_WIDTH / 2;
    }

    get minVisibleY() {
        return this.curPos.y - SCREEN_HEIGHT / 2;
    }

    get maxVisibleX() {
        return this.curPos.x + SCREEN_WIDTH / 2;
    }

    get maxVisibleY() {
        return this.curPos.y + SCREEN_HEIGHT / 2;
    }
}