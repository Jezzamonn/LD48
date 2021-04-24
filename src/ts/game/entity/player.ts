import { Keys } from "../../keys";
import { Entity } from "./entity";

const jumpSpeed = 1500;
const walkSpeed = 1000;

export class Player extends Entity {

    update(dt: number) {
        if (Keys.wasPressedThisFrame('ArrowUp')) {
            console.log('PLayer jump');
            
            this.dy = -jumpSpeed;
        }

        this.dx = 0;
        if (Keys.isPressed('ArrowLeft')) {
            this.dx -= walkSpeed;
        }
        if (Keys.isPressed('ArrowRight')) {
            this.dx += walkSpeed;
        }

        super.update(dt);
    }
}