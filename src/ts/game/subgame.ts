import { Camera } from "./camera/camera";
import { Level } from "./level";

export class SubGame {

    level!: Level;
    camera: Camera = new Camera();

    constructor() {
        this.camera.getTargetPosition = () => ({
            x: this.level.player.midX,
            y: this.level.player.midY,
        });
    }

    update(dt: number) {
        this.level.update(dt);

        this.camera.update(dt);
    }

    render(context: CanvasRenderingContext2D) {
        this.camera.applyToContext(context);

        this.level.render(context);
    }
}