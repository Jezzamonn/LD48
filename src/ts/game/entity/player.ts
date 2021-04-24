import { Keys } from "../../keys";
import { Entity } from "./entity";

const jumpSpeed = 1500;
const walkSpeed = 1000;

export class Player extends Entity {

    midAir = true;

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

        if (this.midAir) {
            this.dy += this.gravity * dt;
        }
        else {
            if (!this.isStandingOnGround()) {
                this.midAir = true;
            }
        }

        this.moveX(dt);
        this.moveY(dt);

    }

    onDownCollision() {
        super.onDownCollision();

        this.midAir = false;
    }
}