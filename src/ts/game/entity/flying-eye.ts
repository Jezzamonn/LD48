import { Entity, FacingDir } from "./entity";
import { fromPx, rng, toRoundedPx } from "../constants";
import { Level } from "../level";
import * as Aseprite from "../../aseprite";
import { Sounds } from "../../sounds";

Aseprite.loadImage({name: 'flying_eye', basePath: 'sprites/'});

const jitterAmt = fromPx(1.5);

export class FlyingEye extends Entity {

    hurtCount = 0;
    hurtCountLength = 0.1;

    jitterPhase = 0;

    constructor(level: Level) {
        super(level);

        this.name = 'FlyingEye';
        this.w = fromPx(8);
        this.h = fromPx(8);

        this.gravity = 0;
        this.isEnemy = true;
        this.health = 3;

        this.jitterPhase = rng();
    }

    update(dt: number) {
        super.update(dt);

        if (this.hurtCount > 0) {
            this.hurtCount -= dt;
        }

        if (this.isTouchingEntity(this.level.player, fromPx(-3))) {
            this.level.player.takeDamage();
        }

        this.facingDir = this.level.player.midX > this.midX ? FacingDir.RIGHT : FacingDir.LEFT;
    }

    render(context: CanvasRenderingContext2D) {

        const xJitter = Math.cos(2.5 * Math.PI * (this.animCount + this.jitterPhase + 0.3));
        const yJitter = Math.cos(3.5 * Math.PI * (this.animCount + this.jitterPhase));

        Aseprite.drawAnimation({
            context,
            image: 'flying_eye',
            animationName: this.hurtCount > 0 ? 'hurt' : 'flying',
            time: this.animCount,
            position: {
                x: toRoundedPx(this.x + jitterAmt * xJitter),
                y: toRoundedPx(this.y + jitterAmt * yJitter),
            },
            flipped: this.facingDir == FacingDir.RIGHT,
        });
    }

    takeDamage() {
        this.health--;
        Sounds.playSound('hit');

        this.hurtCount = this.hurtCountLength;

        if (this.health == 0) {
            this.removeFromLevel();
        }
    }
}