import { lerp } from "../../util";
import { Point, toRoundedPx } from "../constants";

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
        context.translate(context.canvas.width / 2, context.canvas.height / 2);
        context.translate(toRoundedPx(-this.curPos.x), toRoundedPx(-this.curPos.y));
    }
}