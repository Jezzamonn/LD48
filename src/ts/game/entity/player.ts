import { Keys } from "../../keys";
import { Level } from "../level";
import { Entity, FacingDir } from "./entity";
import { fromPx, rng, toRoundedPx, Power } from "../constants";
import { Pickup } from "./pickup";
import { lerp } from "../../util";
import * as Aseprite from "../../aseprite";
import { Bullet } from "./bullet";
import { Sounds } from "../../sounds";

const jumpSpeed = 1550;
const walkSpeed = 600;

Aseprite.loadImage({name: 'character', basePath: 'sprites/'});

Sounds.loadSound({name: 'jump', path: 'sfx/'});
Sounds.loadSound({name: 'land', path: 'sfx/'});
Sounds.loadSound({name: 'shoot', path: 'sfx/'});
Sounds.loadSound({name: 'shoot2', path: 'sfx/'});
Sounds.loadSound({name: 'explosion', path: 'sfx/'});

export class Player extends Entity {

    midAirJumps = 1;
    midAirJumpsLeft = 1;
    midAir = true;
    pickup?: Pickup;
    crouching = false;
    shootCooldownTime = 0.15;
    shootCooldown = 0;

    constructor(level: Level) {
        super(level);

        this.name = 'Player';
        this.w = fromPx(8);
        this.h = fromPx(12);
        this.debugColor = undefined;//'#fc9003'

        this.dxDampen = 10000;
    }

    get pickupX() {
        return this.midX + this.facingDirMult * fromPx(6);
    }

    get pickupY() {
        return this.midY + fromPx(2);
    }

    update(dt: number) {
        this.animCount += dt;

        if (this.shootCooldown > 0) {
            this.shootCooldown -= dt;
        }

        if (Keys.wasPressedThisFrame('ArrowUp')) {
            if (!this.midAir) {
                this.jump();
                this.midAirJumpsLeft = this.midAirJumps;
            }
            else if (this.midAirJumpsLeft > 0 && this.level.subGame.game.currentPowers.has(Power.DOUBLE_JUMP)) {
                this.jump();
                this.midAirJumpsLeft--;
            }
        }

        this.crouching = Keys.isPressed('ArrowDown');

        // TODO: Smoothen this.
        this.dampen(dt);
        if (!this.crouching) {
            if (Keys.isPressed('ArrowLeft')) {
                this.facingDir = FacingDir.LEFT;
                this.dx = -walkSpeed;
            }
            if (Keys.isPressed('ArrowRight')) {
                this.facingDir = FacingDir.RIGHT;
                this.dx = walkSpeed;
            }
        }

        if (this.crouching && !this.midAir) {
            if (Keys.wasPressedThisFrame('KeyX')) {
                if (this.pickup == null) {
                    this.checkForPickup();
                }
                else {
                    this.dropPickup();
                }
            }
        }
        else {
            if (this.level.subGame.game.currentPowers.has(Power.SHOOT) &&
                Keys.isPressed('KeyX') &&
                this.shootCooldown <= 0) {

                this.fire();
            }
        }

        if (this.pickup != null) {
            this.pickup.midX = this.pickupX;
            this.pickup.midY = this.pickupY;
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

    jump() {
        this.dy = -jumpSpeed;
        Sounds.playSound('jump');
    }

    fire() {
        Sounds.playSound('shoot');

        const bullet = new Bullet(this.level);
        bullet.midX = this.pickupX;
        bullet.midY = this.pickupY;
        bullet.facingDir = this.facingDir;
        bullet.updateSpeed();
        this.level.entities.push(bullet);

        this.shootCooldown = this.shootCooldownTime;
    }

    checkForPickup() {
        for (const pickup of this.level.entitiesOfType(Pickup)) {
            if (this.isTouchingEntity(pickup, 2)) {
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
        else if (this.crouching) {
            animName = 'crouch';
        }
        else {
            if (Keys.isPressed('ArrowLeft') || Keys.isPressed('ArrowRight')) {
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

        Sounds.playSound('land');
    }

    takeDamage() {
        // Wowo!
        Sounds.playSound('explosion');
        this.level.reset();
    }
}