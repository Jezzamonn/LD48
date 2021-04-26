import { Sounds } from "../../sounds";
import { fromPx, toRoundedPx } from "../constants";
import { Level } from "../level";
import { Entity, FacingDir } from "./entity";
import * as Aseprite from "../../aseprite";


export class Boss extends Entity {
    hurtCount = 0;
    hurtCountLength = 0.1;

    constructor(level: Level) {
        super(level);

        this.name = 'Boss';
        this.w = fromPx(16);
        this.h = fromPx(16);

        this.gravity = 0;
        this.isEnemy = true;
        this.health = 12;
    }

    update(dt: number) {
        super.update(dt);

        // TODO: Move in some pattern.

        // TODO: Fire off bat dudes

        if (this.hurtCount > 0) {
            this.hurtCount -= dt;
        }

        if (this.isTouchingEntity(this.level.player, fromPx(-3))) {
            this.level.player.takeDamage();
        }

        this.facingDir = this.level.player.midX > this.midX ? FacingDir.RIGHT : FacingDir.LEFT;
    }

    render(context: CanvasRenderingContext2D) {
        Aseprite.drawAnimation({
            context,
            image: 'flying_eye',
            animationName: this.hurtCount > 0 ? 'hurt' : 'flying',
            time: this.animCount,
            position: {
                x: toRoundedPx(this.x),
                y: toRoundedPx(this.y)
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