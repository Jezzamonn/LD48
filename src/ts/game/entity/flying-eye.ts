import { Entity } from "./entity";
import { fromPx, toRoundedPx } from "../constants";
import { Level } from "../level";
import * as Aseprite from "../../aseprite";

Aseprite.loadImage({name: 'flying_eye', basePath: 'sprites/'});

export class FlyingEye extends Entity {

    constructor(level: Level) {
        super(level);

        this.name = 'FlyingEye';
        this.w = fromPx(8);
        this.h = fromPx(8);

        this.gravity = 0;
    }

    render(context: CanvasRenderingContext2D) {
        Aseprite.drawAnimation({
            context,
            image: 'flying_eye',
            animationName: 'flying',
            time: this.animCount,
            position: {
                x: toRoundedPx(this.x),
                y: toRoundedPx(this.y)
            },
        });
    }
}