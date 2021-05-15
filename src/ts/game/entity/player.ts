import { IKeys, Keys, NullKeys } from "../../keys";
import { Level } from "../level";
import { Entity, FacingDir } from "./entity";
import { fromPx, rng, toRoundedPx, Power, Point, SCREEN_HEIGHT } from "../constants";
import { Pickup } from "./pickup";
import { clampedSplitInternal, splitInternal } from "../../util";
import * as Aseprite from "../../aseprite";
import { Bullet } from "./bullet";
import { Sounds } from "../../sounds";

const jumpSpeed = 1550;
const bigJumpSpeed = 2500;
const walkSpeed = 600;
const knockBackXSpeed = 300;
const knockBackYSpeed = 1000;
const landTime = 0.15;
const wallBumpTime = 0.1;
const headBumpTime = 0.15;

Aseprite.loadImage({name: 'character', basePath: 'sprites/'});

Sounds.loadSound({name: 'jump', path: 'sfx/'});
Sounds.loadSound({name: 'land', path: 'sfx/'});
Sounds.loadSound({name: 'shoot', path: 'sfx/'});
Sounds.loadSound({name: 'shoot2', path: 'sfx/'});
Sounds.loadSound({name: 'explosion', path: 'sfx/'});
Sounds.loadSound({name: 'hit', path: 'sfx/'});

export class Player extends Entity {

    midAirJumps = 1;
    midAirJumpsLeft = 1;
    midAir = true;
    pickup?: Pickup;
    crouching = false;
    shootCooldownTime = 0.15;
    shootCooldown = 0;
    landCount = 0;
    wallBumpCount = 0;
    canWallBump = true;
    headBumpCount = 0;
    isDead = false;
    deathAnim = 'die';

    lastX = 0;

    constructor(level: Level) {
        super(level);

        this.name = 'Player';
        this.w = fromPx(8);
        this.h = fromPx(12);
        this.debugColor = undefined;//'#fc9003'

        this.dxDampen = 10000;
    }

    get cameraPos(): Point {
        const x = this.level.player.midX + this.level.player.facingDirMult * fromPx(20);
        let y = this.level.player.midY - Math.round(0.12 * SCREEN_HEIGHT);

        if (this.crouching) {
            y += Math.round(0.3 * SCREEN_HEIGHT);
        }
        if (this.midAir) {
            const jumpAmt = splitInternal(this.dy, -jumpSpeed, jumpSpeed);
            y += (jumpAmt + 0.1) * Math.round(0.5 * SCREEN_HEIGHT);
        }
        return {x, y};
    }

    get pickupX() {
        let pxDist = 6;
        if (this.shootCooldown > 0.7 * this.shootCooldownTime) {
            pxDist = 5;
        }
        return this.midX + this.facingDirMult * fromPx(pxDist);
    }

    get pickupY() {
        return this.midY + fromPx(2);
    }

    get keys(): IKeys {
        if (this.isDead) {
            return NullKeys;
        }
        return Keys;
    }

    update(dt: number) {
        this.animCount += dt;

        if (this.shootCooldown > 0) {
            this.shootCooldown -= dt;
        }

        if (this.landCount > 0) {
            this.landCount -= dt;
        }

        if (this.wallBumpCount > 0) {
            this.wallBumpCount -= dt;
        }

        if (this.headBumpCount > 0) {
            this.headBumpCount -= dt;
        }

        if (this.isDead) {
            // Using Keys directly
            if (Keys.isPressed('KeyX') || Keys.isPressed('Space')) {
                this.respawn();
                return; // idk if this makes sense
            }
        }

        if (this.keys.wasPressedThisFrame('ArrowUp')) {
            if (!this.midAir) {
                this.jump();
                this.midAirJumpsLeft = this.midAirJumps;
            }
            else if (this.midAirJumpsLeft > 0 && this.level.subGame.game.currentPowers.has(Power.DOUBLE_JUMP)) {
                this.jump();
                this.midAirJumpsLeft--;
            }
        }

        this.crouching = this.keys.isPressed('ArrowDown');

        // TODO: Smoothen this.
        if (this.isDead) {
            if (!this.midAir) {
                this.dampen(dt);
            }
        }
        else {
            this.dampen(dt);
            if (!this.crouching) {
                if (this.keys.isPressed('ArrowLeft')) {
                    if (this.facingDir != FacingDir.LEFT) {
                        this.wallBumpCount = 0;
                        this.canWallBump = true;
                    }
                    this.facingDir = FacingDir.LEFT;
                    this.dx = -walkSpeed;
                }
                if (this.keys.isPressed('ArrowRight')) {
                    if (this.facingDir != FacingDir.RIGHT) {
                        this.wallBumpCount = 0;
                        this.canWallBump = true;
                    }
                    this.facingDir = FacingDir.RIGHT;
                    this.dx = walkSpeed;
                }
            }
        }

        if (this.crouching && !this.midAir) {
            if (this.keys.wasPressedThisFrame('KeyX')) {
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
                this.keys.isPressed('KeyX') &&
                this.shootCooldown <= 0) {

                this.fire();
            }
        }

        if (this.pickup != null) {
            this.pickup.midX = this.pickupX;
            this.pickup.midY = this.pickupY;
        }


        if (this.midAir) {
            // To emphasize the head bump, don't apply gravity for a bit
            if (this.headBumpCount < 0.5 * headBumpTime) {

                // If the player is moving up but they're not holding up, apply
                // extra gravity to make the jump shorter.
                if (this.dy < 0 && !this.keys.isPressed('ArrowUp')) {
                    this.applyGravity(3 * dt);
                }
                else {
                    this.applyGravity(dt);
                }
            }
        }
        else {
            if (!this.isStandingOnGround()) {
                this.midAir = true;
            }
        }

        this.lastX = this.x;

        this.moveX(dt);
        this.moveY(dt);

        if (this.lastX != this.x && this.wallBumpCount < 0.9 * wallBumpTime) {
            this.canWallBump = true;
        }
    }

    jump() {
        if (this.level.subGame.game.currentPowers.has(Power.BIG_JUMP)) {
            this.dy = -bigJumpSpeed;
        }
        else {
            this.dy = -jumpSpeed;
        }

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

        if (this.isDead) {
            if (this.midAir) {
                animName = 'hurt-falling';
            }
            else {
                animName = this.deathAnim;
                const animLength = (Aseprite.images['character'].animations!)[this.deathAnim].length / 1000;
                if (this.animCount > animLength - 0.001) {
                    this.animCount = animLength - 0.001;
                }
            }
        }
        else if (this.headBumpCount > 0) {
            animName = 'head-bump';
            const animPosition = clampedSplitInternal(this.headBumpCount, headBumpTime, 0);
            const animLength = (Aseprite.images['character'].animations!)['head-bump'].length / 1000;
            this.animCount = animPosition * animLength;
        }
        else if (this.wallBumpCount > 0) {
            animName = 'wall-bump';
            const animPosition = clampedSplitInternal(this.wallBumpCount, wallBumpTime, 0);
            const animLength = (Aseprite.images['character'].animations!)['wall-bump'].length / 1000;
            this.animCount = animPosition * animLength;
        }
        else if (this.midAir) {
            const jumpAnimSwitch = 400;
            if (this.dy < -0.7 * jumpSpeed) {
                animName = 'jump-up-stretch';
            }
            else if (this.dy < -jumpAnimSwitch) {
                animName = 'jump-up';
            }
            else if (this.dy > jumpAnimSwitch) {
                animName = 'jump-down';
            }
            else {
                animName = 'jump-mid';
                // Pick the right frame based on the y speed
                // Also, just realized this function is the inverse lerp haha
                const animPosition = clampedSplitInternal(this.dy, -jumpAnimSwitch, jumpAnimSwitch);

                const animLength = (Aseprite.images['character'].animations!)['jump-mid'].length / 1000;
                this.animCount = animPosition * animLength;
            }
        }
        else if (this.crouching) {
            animName = 'crouch';
        }
        else if (this.landCount > 0) {
            animName = 'land';
            const animPosition = clampedSplitInternal(this.landCount, landTime, 0);
            const animLength = (Aseprite.images['character'].animations!)['land'].length / 1000;
            this.animCount = animPosition * animLength;
        }
        else {
            if (this.lastX != this.x) {
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
        this.landCount = landTime;

        if (this.isDead) {
            this.animCount = 0;
            this.deathAnim = rng() < 0.1 ? 'place-grave' : 'die';
        }

        Sounds.playSound('land');
    }

    onUpCollision() {
        super.onUpCollision();

        this.headBumpCount = headBumpTime;
        Sounds.playSound('land', {volume: 0.3});
    }

    onLeftCollision() {
        super.onLeftCollision();

        this.checkWallBump();
    }

    onRightCollision() {
        super.onRightCollision();

        this.checkWallBump();
    }

    checkWallBump() {
        if (this.canWallBump) {
            this.wallBumpCount = wallBumpTime;
            this.canWallBump = false;
            Sounds.playSound('land', {volume: 0.3});
        }
    }

    respawn() {
        Sounds.playSound('explosion');
        this.level.reset();
    }

    takeDamage() {
        // TODO: Hurt SFX
        this.dx = this.facingDirMult * -knockBackXSpeed;
        this.dy = -knockBackYSpeed;
        this.midAir = true;
        this.isDead = true;
    }
}