import { Sounds } from "../../sounds";
import { fromPx, Point, rng, toRoundedPx } from "../constants";
import { Level } from "../level";
import { Entity, FacingDir } from "./entity";
import * as Aseprite from "../../aseprite";
import { Pickup } from "./pickup";
import { lerp } from "../../util";

const scale = 3;

export class Boss extends Entity {
    hurtCount = 0;
    hurtCountLength = 0.1;

    targets: Point[] = [];
    target?: Point;

    constructor(level: Level) {
        super(level);

        this.name = 'Boss';
        this.w = fromPx(8 * scale);
        this.h = fromPx(8 * scale);

        this.gravity = 0;
        this.isEnemy = true;
        this.health = 45;
    }

    makeTargets() {
        const xMoveAmt = 100;
        const yMoveAmt = 60;
        for (let i = 0; i < 10; i++) {
            const ranX = lerp(fromPx(-xMoveAmt), fromPx(xMoveAmt), rng());
            const ranY = lerp(fromPx(-yMoveAmt), 0, rng());
            this.targets.push({x: this.midX + ranX, y: this.midY + ranY});
        }

        this.target = this.targets[0];
    }

    update(dt: number) {
        super.update(dt);

        // TODO: Move in some pattern.
        if (this.target) {
            this.x = lerp(this.x, this.target.x, 0.02);
            this.y = lerp(this.y, this.target.y, 0.02);
        }

        if (rng() < 0.03) {
            this.target = this.targets[Math.floor(this.targets.length * rng())];
        }

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
            flippedX: this.facingDir == FacingDir.RIGHT,
            scale,
            filter: this.level.subGame.hueRotateFilter,
        });
    }

    takeDamage() {
        this.health--;
        Sounds.playSound('hit');

        this.hurtCount = this.hurtCountLength;

        if (this.health == 0) {
            const pickup = new Pickup(this.level);
            pickup.midX = this.midX;
            pickup.midY = this.midY;
            pickup.dx = rng() < 0.5 ? -500 : 500;
            pickup.dy = -700;
            pickup.subGameIndex = 11;
            this.level.entities.push(pickup);

            this.removeFromLevel();


        }
    }
}