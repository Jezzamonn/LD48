import { Entity } from "./entity";
import { fromPx, toRoundedPx } from "../constants";
import { Level } from "../level";
import * as Aseprite from "../../aseprite";
import { Sounds } from "../../sounds";

Aseprite.loadImage({name: 'flying_eye', basePath: 'sprites/'});

export class FlyingEye extends Entity {

    hurtCount = 0;
    hurtCountLength = 0.1;

    constructor(level: Level) {
        super(level);

        this.name = 'FlyingEye';
        this.w = fromPx(8);
        this.h = fromPx(8);

        this.gravity = 0;
        this.isEnemy = true;
        this.health = 3;
    }

    update(dt: number) {
        super.update(dt);

        if (this.hurtCount > 0) {
            this.hurtCount -= dt;
        }

        if (this.isTouchingEntity(this.level.player, -1)) {
            this.level.player.takeDamage();
        }
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