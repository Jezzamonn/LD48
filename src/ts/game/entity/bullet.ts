import { Entity, FacingDir } from "./entity";
import * as Aseprite from "../../aseprite";
import { fromPx, toRoundedPx } from "../constants";
import { Level } from "../level";
// import { FlyingEye } from "./flying-eye";

Aseprite.loadImage({name: 'bullet', basePath: 'sprites/'});

export class Bullet extends Entity {
    constructor(level: Level) {
        super(level);
        this.w = fromPx(5);
        this.h = fromPx(7);
        this.gravity = 0;
        this.debugColor = '#387eff';

        this.lifeTime = 0.4;
    }

    updateSpeed() {
        this.dx = 2000 * this.facingDirMult;
    }

    update(dt: number) {
        super.update(dt);

        // Then check for collisions
        for (const ent of this.level.entities.filter(ent => ent.isEnemy)) {
            if (ent === this) {
                continue;
            }

            if (this.isTouchingEntity(ent)) {
                ent.takeDamage();
                this.removeFromLevel();
                // TODO: Play SFX
            }
        }
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

    // TODO: Would be nice to have a particle here.
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