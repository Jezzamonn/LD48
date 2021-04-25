import { Entity, FacingDir } from "./entity";
import * as Aseprite from "../../aseprite";
import { fromPx, toRoundedPx } from "../constants";
import { Level } from "../level";

Aseprite.loadImage({name: 'bullet', basePath: 'sprites/'});

export class Bullet extends Entity {
    constructor(level: Level) {
        super(level);
        this.w = fromPx(5);
        this.h = fromPx(7);
        this.gravity = 0;
        this.debugColor = '#387eff';
    }

    updateSpeed() {
        this.dx = 2000 * this.facingDirMult;
    }

    render(context: CanvasRenderingContext2D) {
        super.render(context);

        Aseprite.drawSprite({
            context,
            image: 'bullet',
            frame: 0,
            position: {
                x: toRoundedPx(this.x),
                y: toRoundedPx(this.y)
            },
            flipped: this.facingDir == FacingDir.LEFT,
        });
    }

    onUpCollision() {
        this.removeFromLevel();
    }
    onDownCollision() {
        this.removeFromLevel();
    }
    onLeftCollision() {
        this.removeFromLevel();
    }
    onRightCollision() {
        this.removeFromLevel();
    }
}