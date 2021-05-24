import { fromPx, Point, Power, toRoundedPx } from "../constants";
import { Level } from "../level";
import { Entity, FacingDir } from "./entity";
import * as Aseprite from "../../aseprite";

export class Particle extends Entity {

    imageName: string;
    animationName?: string;
    renderPos: Point;
    lifeTimeMult: number;
    dampAmt: number = 1;
    flippedY = false;

    constructor(
        level: Level,
        {
            imageName,
            animationName=undefined,
            renderPos=undefined,
            lifeTimeMult=1,
            lifeTime=undefined,
            flippedY=false,
        }: {
            imageName: string,
            animationName?: string,
            renderPos?: Point,
            lifeTimeMult?: number,
            lifeTime?: number,
            flippedY?: boolean,
        }
    ) {
        super(level);

        this.name = 'Particle';
        this.imageName = imageName;
        this.animationName = animationName;
        this.renderPos = renderPos ?? {x: 0.5, y: 0.5};
        this.gravity = 0;
        if (lifeTime != null) {
            this.lifeTime = lifeTime;
            this.lifeTimeMult = Number.POSITIVE_INFINITY;
        }
        else {
            this.lifeTimeMult = lifeTimeMult;
        }
        this.flippedY = flippedY;

        Aseprite.loadImage({name: imageName, basePath: 'sprites/'});
    }

    update(dt: number) {
        super.update(dt);

        this.dx *= this.dampAmt;
        this.dy *= this.dampAmt;

        if (this.animationName == null) {
            return;
        }
        const anim = Aseprite.images[this.imageName]?.animations?.[this.animationName];
        if (anim == null) {
            return;
        }
        const animLength = anim.length / 1000;
        if (this.animCount > animLength * this.lifeTimeMult) {
            this.done = true;
        }
    }

    render(context: CanvasRenderingContext2D) {
        const sharedParams = {
        }

        if (this.animationName == null) {
            Aseprite.drawSprite({
                context,
                image: this.imageName,
                position: {
                    x: toRoundedPx(this.x),
                    y: toRoundedPx(this.y),
                },
                flippedX: this.facingDir == FacingDir.LEFT,
                flippedY: this.flippedY,
                anchorRatios: this.renderPos,

                frame: 0,
            });
        }
        else {
            Aseprite.drawAnimation({
                context,
                image: this.imageName,
                position: {
                    x: toRoundedPx(this.x),
                    y: toRoundedPx(this.y),
                },
                flippedX: this.facingDir == FacingDir.LEFT,
                flippedY: this.flippedY,
                anchorRatios: this.renderPos,

                animationName: this.animationName,
                time: this.animCount,
            });
        }
    }
}