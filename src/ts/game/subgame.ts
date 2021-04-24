import { Camera } from "./camera/camera";
import { CANVAS_SCALE, PX_SCREEN_HEIGHT, PX_SCREEN_WIDTH } from "./constants";
import { Game } from "./game";
import { Level } from "./level";

export class SubGame {

    canvas!: HTMLCanvasElement;
    context!: CanvasRenderingContext2D;

    index: number;
    game: Game;
    level!: Level;
    camera: Camera = new Camera();

    constructor(game: Game, index: number) {
        this.game = game;
        this.index = index;

        this.canvas = document.createElement('canvas');
        this.canvas.width = PX_SCREEN_WIDTH;
        this.canvas.height = PX_SCREEN_HEIGHT;
        this.canvas.style.width = (CANVAS_SCALE * PX_SCREEN_WIDTH) + 'px';
        this.canvas.style.height = (CANVAS_SCALE * PX_SCREEN_HEIGHT) + 'px';
        this.canvas.classList.add('canvas');

        this.context = this.canvas.getContext('2d')!;

        this.camera.getTargetPosition = () => ({
            x: this.level.player.midX,
            y: this.level.player.midY,
        });
    }

    update(dt: number) {
        this.level.update(dt);

        this.camera.update(dt);
    }

    render() {
        this.context.resetTransform();

        this.camera.applyToContext(this.context);

        this.level.render(this.context);
    }
}