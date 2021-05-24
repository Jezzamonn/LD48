import { fromPx, Point, Power, toRoundedPx } from "../constants";
import { Level } from "../level";
import { Entity, FacingDir } from "./entity";
import * as Aseprite from "../../aseprite";

export class Particle extends Entity {

    imageName: string;
    animationName: string;
    renderPos: Point;

    constructor(level: Level, imageName: string, animationName: string, renderPos: Point) {
        super(level);

        this.name = 'Particle';
        this.imageName = imageName;
        this.animationName = animationName;
        this.renderPos = renderPos;

        Aseprite.loadImage({name: imageName, basePath: 'sprites/'});
    }

    update(dt: number) {
        super.update(dt);

        const anim = Aseprite.images[this.imageName]?.animations?.[this.animationName];
        if (anim == null) {
            return;
        }
        const animLength = anim.length / 1000;
        if (this.animCount > animLength) {
            this.done = true;
        }
    }

    render(context: CanvasRenderingContext2D) {
        Aseprite.drawAnimation({
            context,
            image: this.imageName,
            animationName: this.animationName,
            time: this.animCount,
            position: {
                x: toRoundedPx(this.x),
                y: toRoundedPx(this.y),
            },
            flipped: this.facingDir == FacingDir.LEFT,
            anchorRatios: this.renderPos,
        });
    }
}