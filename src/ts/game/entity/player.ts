import { Keys } from "../../keys";
import { Level } from "../level";
import { Entity } from "./entity";
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
        this.h = fromPx(10);
        this.debugColor = '#fc9003'
    }

    update(dt: number) {
        if (Keys.wasPressedThisFrame('ArrowUp') && !this.midAir) {
            this.dy = -jumpSpeed;
        }

        this.dx = 0;
        if (Keys.isPressed('ArrowLeft')) {
            this.dx -= walkSpeed;
        }
        if (Keys.isPressed('ArrowRight')) {
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

        Aseprite.drawSprite({
            context,
            image: "character",
            frame: 0,
            position: {
                x: toRoundedPx(this.midX),
                y: toRoundedPx(this.maxY),
            },
            anchorRatios: {
                x: 0.5,
                y: 1,
            }
        });

        this.pickup?.render(context);
    }

    onDownCollision() {
        super.onDownCollision();

        this.midAir = false;
    }
}