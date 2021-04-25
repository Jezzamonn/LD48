import { Keys } from "../../keys";
import { Level } from "../level";
import { Entity, FacingDir } from "./entity";
import { fromPx, rng, toRoundedPx } from "../constants";
import { Pickup } from "./pickup";
import { lerp } from "../../util";
import * as Aseprite from "../../aseprite";

const jumpSpeed = 1500;
const walkSpeed = 1000;

Aseprite.loadImage({name: 'character', basePath: 'sprites/'});

export class Player extends Entity {

    midAir = true;
    pickup?: Pickup;

    constructor(level: Level) {
        super(level);

        this.name = 'Player';
        this.w = fromPx(8);
        this.h = fromPx(12);
        this.debugColor = undefined;//'#fc9003'
    }

    update(dt: number) {
        this.animCount += dt;

        if (Keys.wasPressedThisFrame('ArrowUp') && !this.midAir) {
            this.dy = -jumpSpeed;
        }

        // TODO: Smoothen this.
        this.dx = 0;
        if (Keys.isPressed('ArrowLeft')) {
            this.facingDir = FacingDir.LEFT;
            this.dx -= walkSpeed;
        }
        if (Keys.isPressed('ArrowRight')) {
            this.facingDir = FacingDir.RIGHT;
            this.dx += walkSpeed;
        }

        if (Keys.wasPressedThisFrame('KeyX')) {
            console.log('Picked up?');

            if (this.pickup == null) {
                this.checkForPickup();
            }
            else {
                this.dropPickup();
            }
        }

        if (this.pickup != null) {
            this.pickup.midX = this.midX;
            this.pickup.midY = this.midY;
        }


        if (this.midAir) {
            this.applyGravity(dt);
        }
        else {
            if (!this.isStandingOnGround()) {
                this.midAir = true;
            }
        }

        this.moveX(dt);
        this.moveY(dt);
    }

    checkForPickup() {
        for (const pickup of this.level.entities.filter(ent => ent instanceof Pickup)) {
            if (this.isTouchingEntity(pickup)) {
                pickup.removeFromLevel();
                this.pickup = pickup;
                this.level.subGame.game.updateCanvases();
                return;
            }
        }

    }

    dropPickup() {
        if (this.pickup == null) {
            return;
        }

        this.level.entities.push(this.pickup);
        this.pickup.dx = rng() < 0.5 ? -300 : 300;
        this.pickup.dy = -500;
        // Drop it
        this.pickup = undefined;

        this.level.subGame.game.updateCanvases();
    }

    render(context: CanvasRenderingContext2D) {
        super.render(context);

        // Just figure out the animation based on what's happening?
        let animName = 'idle';
        if (this.midAir) {
            const jumpAnimSwitch = 400;
            if (this.dy < -jumpAnimSwitch) {
                animName = 'jump-up'
            }
            else if (this.dy > jumpAnimSwitch) {
                animName = 'jump-down'
            }
            else {
                animName = 'jump-mid'
            }
        }
        else {
            if (Math.abs(this.dx) > 100) {
                animName = 'run';
            }
        }

        Aseprite.drawAnimation({
            context,
            image: "character",
            animationName: animName,
            time: this.animCount,
            position: {
                x: toRoundedPx(this.midX),
                y: toRoundedPx(this.maxY),
            },
            anchorRatios: {
                x: 0.5,
                y: 1,
            },
            flipped: this.facingDir == FacingDir.LEFT,
        });

        this.pickup?.render(context);
    }

    onDownCollision() {
        super.onDownCollision();

        this.midAir = false;
    }
}